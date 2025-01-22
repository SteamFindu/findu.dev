use std::sync::Arc;
use tower_http::services::ServeDir;

use axum::{middleware, Extension, Router};
use tower_http::{services::ServeFile, trace::TraceLayer};

use crate::{
    handler::{auth::auth_handler, public::public_handler, users::users_handler},
    middleware::auth,
    AppState,
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    let content_route = Router::new()
        .route_service("/", ServeFile::new("public/index.html"))
        .route_service("/projects", ServeFile::new("public/projects.html"))
        .route_service("/contact", ServeFile::new("public/contact.html"))
        .route_service("/login", ServeFile::new("public/login.html"))
        .route_service("/register", ServeFile::new("public/register.html"))
        .route_service(
            "/register_success",
            ServeFile::new("public/register_success.html"),
        )
        .route_service(
            "/user/changename",
            ServeFile::new("public/user/change_name.html"),
        )
        .route_service(
            "/user/changepassword",
            ServeFile::new("public/user/change_password.html"),
        )
        .route_service("/users", ServeFile::new("public/user/users.html"))
        .nest("/", public_handler().layer(middleware::from_fn(auth)))
        .nest_service("/styles", ServeDir::new("public/styles"))
        .nest_service("/files", ServeDir::new("public/files"))
        .layer(TraceLayer::new_for_http())
        .layer(Extension(app_state.clone()));

    let api_route = Router::new()
        .nest("/", auth_handler())
        .nest("/user", users_handler().layer(middleware::from_fn(auth)))
        .layer(TraceLayer::new_for_http())
        .layer(Extension(app_state));

    Router::new()
        .nest("/", content_route)
        .nest("/api", api_route)
        .fallback_service(ServeFile::new("public/404.html"))
}
