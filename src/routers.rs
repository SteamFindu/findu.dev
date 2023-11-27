use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
};

#[derive(Template)]
#[template(path = "index.html")]
pub struct SiteTemplate<'a> {
    pub site_title: &'a str,
}

pub async fn site_index() -> impl IntoResponse {
    let template = SiteTemplate {
        site_title: "index",
    };

    match template.render() {
        Ok(html) => Html(html).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "try again later").into_response(),
    }
}
pub async fn site_about() -> impl IntoResponse {
    let template = SiteTemplate {
        site_title: "about",
    };

    match template.render() {
        Ok(html) => Html(html).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "try again later").into_response(),
    }
}
