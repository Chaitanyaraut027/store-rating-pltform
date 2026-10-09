
-- 001_initial_schema.sql

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_name_length
        CHECK (CHAR_LENGTH(BTRIM(name)) BETWEEN 20 AND 60),
    CONSTRAINT users_address_length
        CHECK (CHAR_LENGTH(BTRIM(address)) BETWEEN 1 AND 400),
    CONSTRAINT users_email_not_empty
        CHECK (BTRIM(email) <> ''),
    CONSTRAINT users_email_normalized
        CHECK (email = LOWER(BTRIM(email))),
    CONSTRAINT users_role_valid
        CHECK (role IN ('ADMIN', 'USER', 'STORE_OWNER'))
);

CREATE UNIQUE INDEX users_email_unique ON users(email);


CREATE TABLE stores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    image_url TEXT,
    image_public_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT stores_name_length
        CHECK (CHAR_LENGTH(BTRIM(name)) BETWEEN 20 AND 60),
    CONSTRAINT stores_email_not_empty
        CHECK (BTRIM(email) <> ''),
    CONSTRAINT stores_email_normalized
        CHECK (email = LOWER(BTRIM(email))),
    CONSTRAINT stores_address_length
        CHECK (CHAR_LENGTH(BTRIM(address)) BETWEEN 1 AND 400)
);

CREATE INDEX stores_owner_id_idx ON stores(owner_id);


CREATE TABLE ratings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id BIGINT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ratings_value_valid
        CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT ratings_one_per_user_per_store
        UNIQUE (user_id, store_id)
);

CREATE INDEX ratings_store_id_idx ON ratings(store_id);