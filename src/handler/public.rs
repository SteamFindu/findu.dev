use std::sync::Arc;

use axum::{
    response::{Html, IntoResponse},
    routing::get,
    Extension, Router,
};

use minijinja::context;

use crate::{error::HttpError, middleware::JWTAuthMiddeware, AppState};

pub fn public_handler() -> Router {
    Router::new()
        .route("/me", get(me))
        .route("/login_success", get(login_success))
        .route("/error", get(error))
}

/*
pub async fn index(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
) -> Result<impl IntoResponse, HttpError> {
    let template = app_state.tpl_env.get_template("index.html").unwrap();
    let response = template.render(context! {user => user}).unwrap();
    Ok(Html(response))
}
*/

pub async fn me(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
) -> Result<impl IntoResponse, HttpError> {
    let template = app_state.tpl_env.get_template("user/me.html").unwrap();
    let response = template.render(context! {user => user.user}).unwrap();
    Ok(Html(response))
}

pub async fn login_success(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
) -> Result<impl IntoResponse, HttpError> {
    let template = app_state
        .tpl_env
        .get_template("login_success.html")
        .unwrap();
    let response = template.render(context! {user => user.user}).unwrap();
    Ok(Html(response))
}

pub async fn error(
    Extension(app_state): Extension<Arc<AppState>>,
) -> Result<impl IntoResponse, HttpError> {
    let template = app_state.tpl_env.get_template("error.html").unwrap();
    let response = template.render(context! {error => "error!!"}).unwrap();
    Ok(Html(response))
}
