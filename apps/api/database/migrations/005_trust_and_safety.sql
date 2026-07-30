-- 005_trust_and_safety.sql
-- Tier 1 trust & safety: identity verification gating, structured item declarations,
-- prohibited item categories, and an append-only audit log.

-- =========================
-- USERS: verification status
-- =========================
ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified'
  CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));

ALTER TABLE users ADD COLUMN verification_reference TEXT;

-- =========================
-- ITEM CATEGORIES (server-side prohibited items list)
-- =========================
CREATE TABLE item_categories (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO item_categories (key, label, is_blocked) VALUES
  ('electronics', 'Electronics', false),
  ('documents', 'Documents', false),
  ('clothing', 'Clothing', false),
  ('books', 'Books', false),
  ('cosmetics_toiletries', 'Cosmetics & toiletries', false),
  ('jewelry_valuables', 'Jewelry & valuables', false),
  ('other', 'Other', false),
  ('weapons', 'Weapons', true),
  ('drugs_controlled_substances', 'Drugs & controlled substances', true),
  ('live_animals', 'Live animals', true),
  ('currency_bullion', 'Currency & bullion', true),
  ('hazardous_materials', 'Hazardous materials', true);

-- =========================
-- CONNECTIONS: structured, immutable item declaration
-- =========================
ALTER TABLE connections ADD COLUMN item_category TEXT REFERENCES item_categories(key);
ALTER TABLE connections ADD COLUMN declared_value NUMERIC(10,2);
ALTER TABLE connections ADD COLUMN item_origin_country VARCHAR(2);
ALTER TABLE connections ADD COLUMN accept_reconfirmed_at TIMESTAMP;

CREATE INDEX idx_connections_item_category ON connections(item_category);

-- =========================
-- AUDIT LOGS (append-only)
-- =========================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event TEXT NOT NULL,
  actor_user_id UUID REFERENCES users(id),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only: % not allowed', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_no_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

CREATE TRIGGER audit_logs_no_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();
