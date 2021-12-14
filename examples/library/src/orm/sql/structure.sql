-- Create database
CREATE DATABASE library_db;

-- Create library_status type
DO
$$
    BEGIN
        IF NOT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'library_status') THEN
          CREATE TYPE library_status AS ENUM
            (
              'ACTIVE',
              'INACTIVE'
            );
        END IF;
    END
$$;

-- Create author table
CREATE TABLE IF NOT EXISTS author
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  name                            VARCHAR(200) NOT NULL,
  birth_date                      TIMESTAMP,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create category table
CREATE TABLE IF NOT EXISTS category
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  name                            VARCHAR(200) NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create book table
CREATE TABLE IF NOT EXISTS book
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  category_id                     INTEGER REFERENCES "category" (id) NOT NULL,
  isbn                            VARCHAR(200) PRIMARY KEY NOT NULL,
  title                           VARCHAR(200) NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create book_author table
CREATE TABLE IF NOT EXISTS book_author
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  author_id                       INTEGER REFERENCES "author" (id) NOT NULL,
  book_id                         INTEGER REFERENCES "book" (id) NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create city table
CREATE TABLE IF NOT EXISTS city
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  postal_code                     VARCHAR(200) NOT NULL,
  name                            VARCHAR(200) NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create library table
CREATE TABLE IF NOT EXISTS library
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  city_id                         INTEGER REFERENCES "city" (id) NOT NULL,
  name                            VARCHAR(200) NOT NULL,
  address                         VARCHAR(200) NOT NULL,
  description                     TEXT NOT NULL,
  status                          library_status NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);

-- Create book_library table
CREATE TABLE IF NOT EXISTS book_library
(
  id                              SERIAL PRIMARY KEY NOT NULL,
  library_id                      INTEGER REFERENCES "library" (id) NOT NULL,
  book_id                         INTEGER REFERENCES "book" (id) NOT NULL,
  created_at                      TIMESTAMP DEFAULT now() NOT NULL,
  updated_at                      TIMESTAMP DEFAULT now() NOT NULL,
  removed_at                      TIMESTAMP
);