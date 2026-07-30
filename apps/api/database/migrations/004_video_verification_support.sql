-- 004_video_verification_support.sql
-- Item verification requires photo AND video, so messages must allow a 'video' type

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_message_type_check;

ALTER TABLE messages ADD CONSTRAINT messages_message_type_check
  CHECK (message_type IN ('text', 'image', 'video'));
