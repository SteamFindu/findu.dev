use axum::response::Html;
use axum::routing::get;
use axum::Router;
use std::error::Error;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let connectionstring = "postgresql://postgres:password@localhost/test";
    let connpool = sqlx::postgres::PgPool::connect(connectionstring).await?;

    sqlx::migrate!("./migrations").run(&connpool).await?;

    dbg!(connpool.options());

    let routes = Router::new().route("/", get(|| async { Html("hello") }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("listening on {addr}");

    axum::Server::bind(&addr)
        .serve(routes.into_make_service())
        .await?;

    Ok(())
}
