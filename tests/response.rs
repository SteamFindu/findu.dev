use reqwest::{self, Client};
use std::error::Error;

#[tokio::test]
async fn response() -> Result<(), Box<dyn Error>> {
    let client = Client::new();

    let binding = client
        .get("http://localhost:8080/")
        .send()
        .await
        .expect("failed to get response");

    let res = client
        .get("http://localhost:8080/")
        .send()
        .await
        .expect("failed to get response")
        .text()
        .await
        .expect("Failed to get payload");

    println!("{:?}", binding.status());
    println!("{}", res);
    Ok(())
}
