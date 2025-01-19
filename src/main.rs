mod config;
mod db;
mod dtos;
mod error;
mod handler;
mod middleware;
mod models;
mod routes;
mod utils;

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

    let mut tpl_env = Environment::new();
    tpl_env.set_loader(path_loader("public"));

    let app_state = AppState {
        env: config.clone(),
        db_client,
        tpl_env,
    };

    let app = create_router(Arc::new(app_state.clone()));

    let keyconfig = RustlsConfig::from_pem_file(
        PathBuf::from("/etc/letsencrypt/live/findu.dev/cert.pem"),
        PathBuf::from("/etc/letsencrypt/live/findu.dev/privkey.pem"),
    )
    .await
    .unwrap();

    /*
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", &config.port))
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
    */

    let addr = SocketAddr::from(([127, 0, 0, 1], config.port));

    axum_server::bind_rustls(addr, keyconfig)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
