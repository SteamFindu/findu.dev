use std::sync::Arc;

use axum::{
    extract::Query,
    middleware,
    response::{IntoResponse, Redirect},
    routing::{get, post},
    Extension, Form, Json, Router,
};
use validator::Validate;

use crate::{
    db::UserExt,
    dtos::{
        FilterUserDto, RequestQueryDto, UserListResponseDto, UserPasswordUpdateDto,
        UsernameUpdateDto,
    },
    error::{ErrorMessage, HttpError},
    middleware::{role_check, JWTAuthMiddeware},
    models::UserRole,
    utils::password,
    AppState,
};

pub fn users_handler() -> Router {
    Router::new()
        .route(
            "/users",
            get(get_users).layer(middleware::from_fn(|state, req, next| {
                role_check(state, req, next, vec![UserRole::Admin])
            })),
        )
        .route("/name", post(update_user_username))
        .route("/password", post(update_user_password))
}

pub async fn get_users(
    Extension(app_state): Extension<Arc<AppState>>,
    Query(query_params): Query<RequestQueryDto>,
) -> Result<impl IntoResponse, HttpError> {
    query_params
        .validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let users = app_state
        .db_client
        .get_users()
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user_count = app_state
        .db_client
        .get_user_count()
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let response = UserListResponseDto {
        users: FilterUserDto::filter_users(&users),
        count: user_count,
    };

    Ok(Json(response))
}

pub async fn update_user_username(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Form(body): Form<UsernameUpdateDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user = &user.user;

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    app_state
        .db_client
        .update_user_username(user_id.clone(), &body.username)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let redirect = Redirect::to("/me");
    let mut response = redirect.into_response();
    response.headers_mut();

    Ok(response)
}

pub async fn update_user_password(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Form(body): Form<UserPasswordUpdateDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user = &user.user;

    let user_id = uuid::Uuid::parse_str(&user.id.to_string()).unwrap();

    let result = app_state
        .db_client
        .get_user(Some(user_id.clone()), None)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::unauthorized(
        ErrorMessage::InvalidToken.to_string(),
    ))?;

    let password_match = password::compare(&body.old_password, &user.password)
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    if !password_match {
        return Err(HttpError::bad_request(
            "Old password is incorrect".to_string(),
        ));
    }

    let hash_password =
        password::hash(&body.new_password).map_err(|e| HttpError::server_error(e.to_string()))?;

    app_state
        .db_client
        .update_user_password(user_id.clone(), hash_password)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let redirect = Redirect::to("/me");
    let mut response = redirect.into_response();
    response.headers_mut();

    Ok(response)
}
