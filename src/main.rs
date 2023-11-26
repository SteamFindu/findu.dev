use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::{get, Router},
};
use std::net::SocketAddr;
use tower_http::services::ServeDir;

#[derive(Debug, Template)]
#[template(path = "index.html")]
pub struct SiteTemplate<'a> {
    pub site_title: &'a str,
}

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
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on {addr}");

    axum::Server::bind(&addr)
        .serve(routes.into_make_service())
        .await
        .unwrap();
}

fn routes() -> Router {
    Router::new().route("/", get(site_index))
}

async fn site_index() -> impl IntoResponse {
    let template = SiteTemplate {
        site_title: "index",
    };

    match template.render() {
        Ok(html) => Html(html).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "try again later").into_response(),
    }
}
