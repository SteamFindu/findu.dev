use sqlx::Connection;
use sqlx::Row;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let connectionstring = "postgresql://postgres:password@localhost/test";
    let connpool = sqlx::postgres::PgPool::connect(connectionstring).await?;

    sqlx::migrate!("./migrations").run(&connpool).await?;

    Ok(())
}
