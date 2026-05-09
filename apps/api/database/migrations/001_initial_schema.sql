-- 001_initial_schema.sql
-- Clean initial schema for SendMeAsap / C2C baggage sharing app

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- UPDATED_AT FUNCTION
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- TRIPS
-- =========================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_date DATE NOT NULL,
  available_weight NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_user_trip
  UNIQUE (traveler_id, origin, destination, departure_date, available_weight)
);

CREATE TRIGGER set_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- REQUESTS
-- =========================
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  target_date DATE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_weight NUMERIC(10,2) NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_requests_updated_at
BEFORE UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- CONNECTIONS
-- =========================
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,

  initiator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  initiator_role VARCHAR(20) NOT NULL,
  receiver_role VARCHAR(20) NOT NULL,

  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (
    (trip_id IS NOT NULL AND request_id IS NULL)
    OR
    (trip_id IS NULL AND request_id IS NOT NULL)
  ),

  CHECK (
    initiator_role IN ('sender', 'traveler')
    AND receiver_role IN ('sender', 'traveler')
  ),

  CHECK (
    status IN (
      'pending',
      'accepted',
      'rejected',
      'cancelled',
      'cancelled_due_to_listing_closure'
    )
  ),

  CHECK (initiator_id <> receiver_id)
);

CREATE TRIGGER set_connections_updated_at
BEFORE UPDATE ON connections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX unique_trip_connection_per_sender
ON connections (trip_id, initiator_id)
WHERE trip_id IS NOT NULL;

CREATE UNIQUE INDEX unique_request_connection_per_traveler
ON connections (request_id, initiator_id)
WHERE request_id IS NOT NULL;

-- =========================
-- DEALS
-- =========================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  connection_id UUID UNIQUE REFERENCES connections(id) ON DELETE CASCADE,

  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,

  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status VARCHAR(50) NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  agreed_at TIMESTAMP,
  in_transit_at TIMESTAMP,
  delivered_at TIMESTAMP,
  completed_at TIMESTAMP,

  CHECK (
    status IN (
      'pending',
      'agreed',
      'in_transit',
      'delivered',
      'completed',
      'cancelled',
      'disputed'
    )
  ),

  CHECK (
    trip_id IS NOT NULL OR request_id IS NOT NULL
  ),

  CHECK (
    traveler_id <> sender_id
  )
);

CREATE TRIGGER set_deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- CHATS
-- =========================
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID UNIQUE REFERENCES deals(id) ON DELETE CASCADE,
  connection_id UUID UNIQUE REFERENCES connections(id) ON DELETE CASCADE,

  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (
    deal_id IS NOT NULL OR connection_id IS NOT NULL
  ),

  CHECK (
    traveler_id <> sender_id
  )
);

CREATE TRIGGER set_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  message_type VARCHAR(50) NOT NULL DEFAULT 'text',
  content TEXT,
  file_url TEXT,
  verification_stage VARCHAR(50),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (
    message_type IN ('text', 'image')
  ),

  CHECK (
    content IS NOT NULL OR file_url IS NOT NULL
  ),

  CHECK (
    verification_stage IS NULL OR verification_stage IN (
      'pre_handover',
      'handover',
      'delivery',
      'dispute_evidence'
    )
  )
);

CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- RATINGS
-- =========================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (deal_id, rater_id),

  CHECK (
    rater_id <> rated_user_id
  )
);

CREATE TRIGGER set_ratings_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();