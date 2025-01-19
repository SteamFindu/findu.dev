mod config;
mod db;
mod dtos;
mod error;
mod handler;
mod middleware;
mod models;
mod routes;
mod utils;

use axum::{
    extract::Host,
    handler::HandlerWithoutStateExt,
    http::{uri::Authority, StatusCode, Uri},
    response::Redirect,
    BoxError,
};
use axum_server::tls_rustls::RustlsConfig;
use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;

use config::Config;
use db::DBClient;
use dotenv::dotenv;
use minijinja::{path_loader, Environment};
use routes::create_router;
use sqlx::postgres::PgPoolOptions;

// debug
use tracing_subscriber::filter::LevelFilter;

#[derive(Debug, Clone)]
pub struct AppState {
    pub env: Config,
    pub db_client: DBClient,
    pub tpl_env: Environment<'static>,
}

#[tokio::main]
async fn main() {
    // Diagnostics and debugging
    tracing_subscriber::fmt()
        .with_max_level(LevelFilter::DEBUG)
        .init();

    dotenv().ok();

    let config = Config::init();

    // DATABASE
    let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => {
            println!("Connected to database");
            pool
        }
        Err(err) => {
            println!("Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    let db_client = DBClient::new(pool);

    // ENV
    let mut tpl_env = Environment::new();
    tpl_env.set_loader(path_loader("public"));

    let app_state = AppState {
        env: config.clone(),
        db_client,
        tpl_env,
    };

    let app = create_router(Arc::new(app_state.clone()));

    tokio::spawn(redirect_http_to_https(config.clone()));

    /*
    if cfg!(debug_assertions) {
        let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
        println!("listening on {addr}");
        axum_server::bind(addr)
            .serve(app.into_make_service())
            .await
            .unwrap();
    } else {
    */
    let keyconfig = RustlsConfig::from_pem_file(
        PathBuf::from("/etc/letsencrypt/live/findu.dev/cert.pem"),
        PathBuf::from("/etc/letsencrypt/live/findu.dev/privkey.pem"),
    )
    .await
    .unwrap();

    let addr = SocketAddr::from(([0, 0, 0, 0], config.https));
    println!("listening on {addr}");
    axum_server::bind_rustls(addr, keyconfig)
        .serve(app.into_make_service())
        .await
        .unwrap();
    //};

    /*
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", &config.port))
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
    */
}

#[allow(dead_code)]
async fn redirect_http_to_https(config: Config) {
    fn make_https(host: &str, uri: Uri, https_port: u16) -> Result<Uri, BoxError> {
        let mut parts = uri.into_parts();

        parts.scheme = Some(axum::http::uri::Scheme::HTTPS);

        if parts.path_and_query.is_none() {
            parts.path_and_query = Some("/".parse().unwrap());
        }

        let authority: Authority = host.parse()?;
        let bare_host = match authority.port() {
            Some(port_struct) => authority
                .as_str()
                .strip_suffix(port_struct.as_str())
                .unwrap()
                .strip_suffix(':')
                .unwrap(), // if authority.port() is Some(port) then we can be sure authority ends with :{port}
            None => authority.as_str(),
        };

        parts.authority = Some(format!("{bare_host}:{https_port}").parse()?);

        Ok(Uri::from_parts(parts)?)
    }

    let redirect = move |Host(host): Host, uri: Uri| async move {
        match make_https(&host, uri, config.https) {
            Ok(uri) => Ok(Redirect::permanent(&uri.to_string())),
            Err(error) => {
                println!("failed to convert URI to HTTPS with err {}", error);
                Err(StatusCode::BAD_REQUEST)
            }
        }
    };

    let addr = SocketAddr::from(([0, 0, 0, 0], config.http));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, redirect.into_make_service())
        .await
        .unwrap();
}
