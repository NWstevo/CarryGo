-- 006_terms_acceptance.sql
-- Record when a user accepted the Terms of Service / Privacy Policy at signup.

ALTER TABLE users ADD COLUMN terms_accepted_at TIMESTAMP;
