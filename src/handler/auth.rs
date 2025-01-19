use std::sync::Arc;

use axum::{
    http::{header, HeaderMap},
    response::{IntoResponse, Redirect},
    routing::post,
    Extension, Form, Router,
};
use axum_extra::extract::cookie::Cookie;
use validator::Validate;

use crate::{
    db::UserExt,
    dtos::{LoginUserDto, RegisterUserDto},
    error::{ErrorMessage, HttpError},
    utils::{password, token},
    AppState,
};

pub fn auth_handler() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
}

pub async fn register(
    Extension(app_state): Extension<Arc<AppState>>,
    Form(body): Form<RegisterUserDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let hash_password =
        password::hash(&body.password).map_err(|e| HttpError::server_error(e.to_string()))?;

    let result = app_state
        .db_client
        .save_user(&body.username, &hash_password)
        .await;

    match result {
        Ok(_user) => {
            let redirect = Redirect::to("/register_success");
            let mut response = redirect.into_response();
            response.headers_mut();

            Ok(response)
        }
        Err(sqlx::Error::Database(db_err)) => {
            if db_err.is_unique_violation() {
                Err(HttpError::unique_constraint_violation(
                    ErrorMessage::EmailExist.to_string(),
                ))
            } else {
                Err(HttpError::server_error(db_err.to_string()))
            }
        }
        Err(e) => Err(HttpError::server_error(e.to_string())),
    }
}

pub async fn login(
    Extension(app_state): Extension<Arc<AppState>>,
    Form(body): Form<LoginUserDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state
        .db_client
        .get_user(None, Some(&body.username))
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::bad_request(
        ErrorMessage::WrongCredentials.to_string(),
    ))?;

    let password_matched = password::compare(&body.password, &user.password)
        .map_err(|_| HttpError::bad_request(ErrorMessage::WrongCredentials.to_string()))?;

    if password_matched {
        let token = token::create_token(
            &user.id.to_string(),
            &app_state.env.jwt_secret.as_bytes(),
            app_state.env.jwt_maxage,
        )
        .map_err(|e| HttpError::server_error(e.to_string()))?;

        let cookie_duration = time::Duration::minutes(app_state.env.jwt_maxage * 60);
        let cookie = Cookie::build(("token", token.clone()))
            .path("/")
            .max_age(cookie_duration)
            .http_only(true)
            .build();

        let redirect = Redirect::to("/login_success");

        let mut headers = HeaderMap::new();

        headers.append(header::SET_COOKIE, cookie.to_string().parse().unwrap());

        let mut response = redirect.into_response();
        response.headers_mut().extend(headers);

        Ok(response)
    } else {
        Err(HttpError::bad_request(
            ErrorMessage::WrongCredentials.to_string(),
        ))
    }
}
