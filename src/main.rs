use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::{get, Router},
};
use std::net::SocketAddr;
use tower_http::services::ServeDir;

#[derive(Debug, Template)]
#[template(path = "site.html")]
pub struct SiteTemplate<'a> {
    pub site_title: &'a str,
    pub site_body: &'a str,
}

#[tokio::main]
async fn main() {
    // ---- POSTGRES ----
    let connectionstring = "postgresql://postgres:password@localhost/test";
    let connpool = sqlx::postgres::PgPool::connect(connectionstring)
        .await
        .expect("Could not connect to the database");
    sqlx::migrate!("./migrations").run(&connpool).await.unwrap();

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
    println!("{:12} - handler", "HANDLER");

    let mut template = SiteTemplate {
        site_title: "TestSite",
        site_body: "Testbodyasldjfklsdajflj",
    };

    match template.render() {
        Ok(html) => Html(html).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "try again later").into_response(),
    }
}
