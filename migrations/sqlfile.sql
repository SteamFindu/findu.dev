--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _sqlx_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._sqlx_migrations (
    version bigint NOT NULL,
    description text NOT NULL,
    installed_on timestamp with time zone DEFAULT now() NOT NULL,
    success boolean NOT NULL,
    checksum bytea NOT NULL,
    execution_time bigint NOT NULL
);


ALTER TABLE public._sqlx_migrations OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _sqlx_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._sqlx_migrations (version, description, installed_on, success, checksum, execution_time) FROM stdin;
20241121234447	users	2024-12-06 19:40:28.533538+02	t	\\x938d500f5ee3cafb2b5e27d81dfb9660ab7f9e5c65b3587fe636186a797d7037f224b803aa6a7431474cfbfa75adb9eb	21272403
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, created_at, updated_at) FROM stdin;
1509494e-55da-4ca8-a197-9a00f90f2f15	admin	$argon2id$v=19$m=19456,t=2,p=1$hY5Dvr31siyIdTDzSY53dg$p5uzbK7fwrxv67VwbM+XxLuVDDDiTdVLwok+t6HPFcA	admin	2024-12-06 19:55:12.814772+02	2024-12-06 19:55:12.814772+02
cd6335b5-1bab-4155-b3cf-7705b561795e	testingman	$argon2id$v=19$m=19456,t=2,p=1$khhTjf26Jy2+b4sO3weNnA$vVUpWBkFWRKwlfV8y2zUxvF7ZCCWrj82ULlWtmScDhE	user	2024-12-08 15:10:28.804038+02	2024-12-08 15:21:23.948643+02
80d01499-943c-4cbe-b013-9b442da6a702	New user	$argon2id$v=19$m=19456,t=2,p=1$E8fiNmSKtykD8kEqj7g4CQ$M/iuFqixvts56a0YajVZ7nQUUerWunwGJTaAyYNE+jg	user	2024-12-08 17:08:37.49944+02	2024-12-08 17:08:37.49944+02
\.


--
-- Name: _sqlx_migrations _sqlx_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._sqlx_migrations
    ADD CONSTRAINT _sqlx_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_username_idx ON public.users USING btree (username);


--
-- PostgreSQL database dump complete
--

