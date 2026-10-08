BEGIN;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_username_unique UNIQUE (username),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  CONSTRAINT users_email_normalized CHECK (email = lower(btrim(email)))
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES users(id),
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT posts_content_nonempty CHECK (length(btrim(content)) > 0)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  token_hash TEXT NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sessions_token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX posts_feed_idx ON posts (created_at DESC, id DESC);
CREATE INDEX posts_author_idx ON posts (author_id);
CREATE INDEX sessions_user_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS customer_feedbacks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  category VARCHAR(50) NOT NULL DEFAULT 'Góp ý chất lượng dịch vụ',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT feedback_content_valid CHECK (length(btrim(content)) > 20)
);

CREATE INDEX customer_feedbacks_created_idx ON customer_feedbacks (created_at DESC);

COMMIT;
