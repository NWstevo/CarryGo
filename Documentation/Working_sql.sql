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


--- ENDED ON STATUSES

--BearerId Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyMjI5YjczLWMyMGYtNDFmZS1hNGE2LWFiYWNmOTk4MzQ3MCIsImVtYWlsIjoic3RlcGhlbkBleGFtcGxlLmNvbSIsImlhdCI6MTc3Njc4MzcyNywiZXhwIjoxNzc3Mzg4NTI3fQ.SvUBJWAJozAw4gjmv1DAVSdKITjXGyDbAolEqSZrBsQ
-- caht id: "0567564b-0a49-4bdc-92ae-d3c82a1aa6a4"


