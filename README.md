# Findu.dev
Backend for the website

# Technologies
* Rust
* Postgresql
* Json Web Token
* tailwind (frontend)

# Requirements
* Rust > 1.82 (including cargo)
* PostgreSQL > 16.3

# Getting started
1. Clone the project folder

2. Install [rust](https://www.rust-lang.org/tools/install) and install and set up [postgres](https://www.postgresql.org/download/)

3. add .env file, you can use the provided .env-example as a base. Update the values to your own (change configuration based on your postgres installation)
 
4. sqlx-cli is used for running the migrations for the required database tables, run `cargo install sqlx-cli --no-default-features --features native-tls,postgres`

5. Create the database with `sqlx database create` and run migrations `sqlx migrate run`

6. Then run the application with `cargo run`, by default it runs at [http://localhost:5000/](http://localhost:5000/)


## Additional information

Settings can be changed in [config.rs](./src/config.rs), default port is 5000.

