use axum::routing::{get, Router};
use axum_server::tls_rustls::RustlsConfig;
use std::{net::SocketAddr, path::PathBuf};
use tower_http::services::ServeDir;

mod routers;

#[tokio::main]
async fn main() {
    // ---- POSTGRES ----
    let connectionstring = "postgresql://postgres:password@localhost/test";
    let connpool = sqlx::postgres::PgPool::connect(connectionstring)
        .await
        .expect("Could not connect to the database");
    sqlx::migrate!("./migrations")
        .run(&connpool)
        .await
        .expect("Failed to run migrations");

    // ---- ROUTES ----
    let routes = Router::new()
        .merge(routes())
        .nest_service("/assets", ServeDir::new("assets"));

    // ---- SERVER ----
    if cfg!(debug_assertions) {
        let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
        println!("listening on {addr}");
        axum_server::bind(addr)
            .serve(routes.into_make_service())
            .await
            .unwrap();
    } else {
        let config = RustlsConfig::from_pem_file(
            PathBuf::from("/etc/letsencrypt/live/findu.dev/cert.pem"),
            PathBuf::from("/etc/letsencrypt/live/findu.dev/privkey.pem"),
        )
        .await
        .unwrap();

        let addr = SocketAddr::from(([0, 0, 0, 0], 443));
        println!("listening on {addr}");
        axum_server::bind_rustls(addr, config)
            .serve(routes.into_make_service())
            .await
            .unwrap();
    };
}

fn routes() -> Router {
    Router::new()
        .route("/", get(routers::site_index))
        .route("/about", get(routers::site_about))
}
