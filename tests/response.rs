use anyhow::Result;

#[tokio::test]
async fn response() -> Result<()> {
    reqwest::get("http://127.0.0.1:8080").await?.print().await?;

    Ok(())
}
