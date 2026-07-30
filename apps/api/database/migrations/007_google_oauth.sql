-- 007_google_oauth.sql
-- Support Google sign-in: accounts created via Google have no password.

ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;
