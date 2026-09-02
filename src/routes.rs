use std::sync::Arc;
use axum::{middleware, Extension, Router};
use tower_http::{services::ServeFile, trace::TraceLayer};

use crate::{
    handler::{auth::auth_handler, users::users_handler},
    middleware::auth,
    AppState,
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    let content_route = Router::new()
        .route_service("/", ServeFile::new("../frontend/dist/index.html"))
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
