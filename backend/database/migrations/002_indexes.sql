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
CREATE INDEX idx_ratings_rated_user_id ON ratings(rated_user_id);touch 