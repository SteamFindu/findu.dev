use chrono::{DateTime, Utc};
use core::str;
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::models::User;

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize)]
pub struct RegisterUserDto {
    #[validate(length(min = 1, message = "Username is required"))]
    pub username: String,
    #[validate(length(min = 1, message = "Password is required"))]
    pub password: String,

    #[validate(
        length(min = 1, message = "Confirm Password is required"),
        must_match(other = "password", message = "passwords do not match")
    )]
    pub password_conf: String,
}

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize)]
pub struct LoginUserDto {
    #[validate(length(min = 1, message = "Username is required"))]
    pub username: String,
    #[validate(length(min = 1, message = "Password is required"))]
    pub password: String,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct RequestQueryDto {
    #[validate(range(min = 1))]
    pub page: Option<usize>,
    #[validate(range(min = 1, max = 50))]
    pub limit: Option<usize>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FilterUserDto {
    pub id: String,
    pub username: String,
    pub role: String,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl FilterUserDto {
    pub fn filter_user(user: &User) -> Self {
        FilterUserDto {
            id: user.id.to_string(),
            username: user.username.to_owned(),
            role: user.role.to_str().to_string(),
            created_at: user.created_at.unwrap(),
            updated_at: user.updated_at.unwrap(),
        }
    }

    pub fn filter_users(user: &[User]) -> Vec<FilterUserDto> {
        user.iter().map(FilterUserDto::filter_user).collect()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserListResponseDto {
    pub users: Vec<FilterUserDto>,
    pub count: i64,
}

#[derive(Serialize, Deserialize)]
pub struct Response {
    pub status: &'static str,
    pub message: String,
}

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize)]
pub struct UsernameUpdateDto {
    #[validate(length(min = 1, message = "Username is required"))]
    pub username: String,
}

#[derive(Debug, Validate, Default, Clone, Serialize, Deserialize)]
pub struct UserPasswordUpdateDto {
    #[validate(length(min = 1, message = "New password is required."))]
    pub new_password: String,

    #[validate(
        length(min = 1, message = "New password confirm is required."),
        must_match(other = "new_password", message = "new passwords do not match")
    )]
    pub new_password_confirm: String,

    #[validate(length(min = 1, message = "Old password is required."))]
    pub old_password: String,
}
