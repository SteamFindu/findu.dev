-- Add up migration script here
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "users" (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX users_username_idx ON users (username);
