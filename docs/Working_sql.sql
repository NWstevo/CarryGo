CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Creating a table to hold user's data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users

-- Creating a table to hold trips data
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_date DATE NOT NULL,
  available_weight NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


select * from trips;

-- Creating a table to hold request data
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  target_date DATE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_weight NUMERIC(10,2) NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Updated users by adding a updated at timestamp column

ALTER TABLE users
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE trips
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE requests 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- setting auto update Timestamps
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_requests_updated_at
BEFORE UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



--Testing the updates
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users';


-- Creating deals table to hold data about deals (transactions)

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (trip_id, request_id)
);



-- trigger for deals to be updated at
CREATE TRIGGER set_deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
)

--linking deals to connections
ALTER TABLE deals
ADD COLUMN connection_id UUID REFERENCES connections(id) ON DELETE CASCADE;

-- preventing duplicate deals from the same connection
CREATE UNIQUE INDEX unique_deal_per_connection
ON deals (connection_id)
WHERE connection_id IS NOT NULL;

-- no more use of trip and request ids
ALTER TABLE deals
ALTER COLUMN trip_id DROP NOT NULL;

ALTER TABLE deals
ALTER COLUMN request_id DROP NOT NULL;

-- constraints to ensure that there are no invalid deals
ALTER TABLE deals
ADD CONSTRAINT deals_listing_reference_check
CHECK (
  trip_id IS NOT NULL OR request_id IS NOT NULL
);










SELECT id, traveler_id, origin, destination FROM trips;

SELECT id, sender_id, origin, destination, item_name FROM requests;

-- creating a constraint to prevent a user from creating multiple trip entries with same information

ALTER TABLE trips
ADD CONSTRAINT unique_user_trip
UNIQUE (traveler_id, origin, destination, departure_date, available_weight);



-- creating chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL UNIQUE REFERENCES deals(id) ON DELETE CASCADE,
  traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- trigger for chats to be updated at
CREATE TRIGGER set_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- creating messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- trigger for messages to be updated at
CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

--Ensuring that messages can be text or images


ALTER TABLE messages
ADD COLUMN file_url TEXT;

-- constraint to ensure empty messages can't be sent

ALTER TABLE messages
ADD CONSTRAINT message_content_or_file_check
CHECK (
  content IS NOT NULL OR file_url IS NOT NULL
);



SELECT * from trips

-- creating a table to hold connection data

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

  CHECK (initiator_id <> receiver_id)
);

-- adding trigger to update at
CREATE TRIGGER set_connections_updated_at
BEFORE UPDATE ON connections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- creating constraints so a sender can only request a specific trip once
CREATE UNIQUE INDEX unique_trip_connection_per_sender
ON connections (trip_id, initiator_id)
WHERE trip_id IS NOT NULL;

-- creating constraints so a traveler can offer a specific requenst once
CREATE UNIQUE INDEX unique_request_connection_per_traveler
ON connections (request_id, initiator_id)
WHERE request_id IS NOT NULL;

-- updating connection statuse
ALTER TABLE connections
ADD CONSTRAINT connections_status_check
CHECK (
  status IN (
    'pending',
    'accepted',
    'rejected',
    'cancelled',
    'cancelled_due_to_listing_closure'
  )
);

-- tying chats to connections 


ALTER TABLE chats
ADD COLUMN connection_id UUID UNIQUE REFERENCES connections(id) ON DELETE CASCADE;

ALTER TABLE chats
ALTER COLUMN deal_id DROP NOT NULL;




select * from trips

--Updating a new column for deals table
ALTER TABLE deals
ADD COLUMN agreed_at TIMESTAMP,
ADD COLUMN in_transit_at TIMESTAMP,
ADD COLUMN delivered_at TIMESTAMP,
ADD COLUMN completed_at TIMESTAMP;

ALTER TABLE deals
ADD CONSTRAINT deals_status_check
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
);




--updating message table for verification

ALTER TABLE messages
ADD COLUMN verification_stage VARCHAR(50);

ALTER TABLE messages
ADD CONSTRAINT messages_verification_stage_check
CHECK (
  verification_stage IS NULL OR verification_stage IN (
    'pre_handover',
    'handover',
    'delivery',
    'dispute_evidence'
  )
);

-- creating a table for experience ratingamongst users

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (deal_id, rater_id)
);
--adding the trigger
CREATE TRIGGER set_ratings_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- starting testing from fresh
TRUNCATE TABLE
  ratings,
  messages,
  chats,
  deals,
  connections,
  requests,
  trips,
  users
RESTART IDENTITY CASCADE;
select * from trips

select * from users

ALTER TABLE messages ALTER COLUMN content DROP NOT NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT;







--User 1
--Traveller A
-- Bearer <redacted test token>
-- 1 TripId : e26e1410-ba8e-4cc7-8d66-bf7521724944
-- 2 TripId : d2ba2b8f-91f5-40e9-95b7-67b3961a85f0


-- user 2
-- Sender B
-- Bearer <redacted test token>
--1 requestID: 85e49dbf-f5ae-4900-8c16-e113d1c6ca04

--user 3
-- Hybrid C
-- Bearer <redacted test token>
--TripID 824a4eed-653c-4d1a-9245-07f4a553ad9d
-- requestID 46944fbf-c313-4c46-958a-8516ef08fd89


--user 4
-- Hunter D
-- Bearer <redacted test token>



--First test
-- Hunter D request both trips from A
-- trip1 5fa9d7fa-1d8b-4cf1-9da5-892001b7ac62
-- Accepted connection id 5fa9d7fa-1d8b-4cf1-9da5-892001b7ac62
-- chat ID: 2d2524f1-6ce0-41d8-81ce-20b46690dfa9

-- trip2 c3385e57-def7-46ba-91f8-4caa132a72a2
-- connection rejected c3385e57-def7-46ba-91f8-4caa132a72a2

-- Hunter D request Hybrid C trip
-- tripid e051243b-8904-4995-868f-e92b98835783
-- hybri C accepts e051243b-8904-4995-868f-e92b98835783
-- chat iD: 5ed4233e-b8be-430f-83c0-c6305dd467fd


-- second Test
-- Traveller A signals Sender B to transport his package
-- tripid f3930362-4422-4f89-9875-0b41f64772e3
-- accepted f3930362-4422-4f89-9875-0b41f64772e3
-- chat ID: e32e3904-3abc-4995-8a32-5a3b1883d3c8
-- accepted Deal id: 6547d99c-e581-47ce-b81b-ca34e1f8248b

-- third test
-- Hybrid C offers to take sender B package
-- tripid  98d5c2e8-86e8-448d-b5d5-5ddf1d3a96eb
-- rejected 98d5c2e8-86e8-448d-b5d5-5ddf1d3a96eb





--New SQL migration process
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;





---New Table creation

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


---viewing the table
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name


-- 002_indexes.sql
-- Performance indexes

CREATE INDEX idx_trips_traveler_id ON trips(traveler_id);
CREATE INDEX idx_trips_route_date ON trips(origin, destination, departure_date);

CREATE INDEX idx_requests_sender_id ON requests(sender_id);
CREATE INDEX idx_requests_route_date ON requests(origin, destination, target_date);

CREATE INDEX idx_connections_initiator_id ON connections(initiator_id);
CREATE INDEX idx_connections_receiver_id ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_connections_trip_id ON connections(trip_id);
CREATE INDEX idx_connections_request_id ON connections(request_id);

CREATE INDEX idx_deals_connection_id ON deals(connection_id);
CREATE INDEX idx_deals_traveler_id ON deals(traveler_id);
CREATE INDEX idx_deals_sender_id ON deals(sender_id);
CREATE INDEX idx_deals_status ON deals(status);

CREATE INDEX idx_chats_connection_id ON chats(connection_id);
CREATE INDEX idx_chats_deal_id ON chats(deal_id);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_verification_stage ON messages(verification_stage);

CREATE INDEX idx_ratings_deal_id ON ratings(deal_id);
CREATE INDEX idx_ratings_rated_user_id ON ratings(rated_user_id);


-- verification
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
