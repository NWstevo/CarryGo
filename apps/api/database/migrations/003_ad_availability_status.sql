-- 003_ad_availability_status.sql
-- Ads (trips/requests) need to be closeable once a deal is booked

ALTER TABLE trips ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'booked', 'cancelled'));

ALTER TABLE requests ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'booked', 'cancelled'));

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_requests_status ON requests(status);
