use axum::extract::Query;
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse};
use axum::routing::{get, Route};
use axum::Router;
use serde::Deserialize;
use std::net::SocketAddr;

mod web;

#[tokio::main]
async fn main() {
    // ---- POSTGRES ----
    let connectionstring = "postgresql://postgres:password@localhost/test";
    let connpool = sqlx::postgres::PgPool::connect(connectionstring)
        .await
        .unwrap();
    sqlx::migrate!("./migrations").run(&connpool).await.unwrap();

    // ---- ROUTES ----
    let routes = Router::new().merge(routes());

    // ---- SERVER ----
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("listening on {addr}");

    axum::Server::bind(&addr)
        .serve(routes.into_make_service())
        .await
        .unwrap();
}

fn routes() -> Router {
    Router::new().route("/", get(handler))
}

async fn handler() -> impl IntoResponse {
    println!("{:12} - handler", "HANDLER");

    Html("hello")
}
