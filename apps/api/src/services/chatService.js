const pool = require('../config/db');

/* =========================
   CREATE CHAT FROM CONNECTION
========================= */
const createChatFromConnection = async ({ connection_id, current_user_id }) => {
  const connectionResult = await pool.query(
    'SELECT * FROM connections WHERE id = $1',
    [connection_id]
  );

  const connection = connectionResult.rows[0];

  if (!connection) {
    throw new Error('Connection not found');
  }

  const isParticipant =
    connection.initiator_id === current_user_id ||
    connection.receiver_id === current_user_id;

  if (!isParticipant) {
    throw new Error('You are not allowed to create a chat for this connection');
  }

  if (connection.status !== 'accepted') {
    throw new Error('Chat can only be created from an accepted connection');
  }

  const existingChat = await pool.query(
    'SELECT * FROM chats WHERE connection_id = $1',
    [connection_id]
  );

  if (existingChat.rows.length > 0) {
    return existingChat.rows[0];
  }

  let traveler_id;
  let sender_id;

  if (connection.initiator_role === 'traveler') {
    traveler_id = connection.initiator_id;
    sender_id = connection.receiver_id;
  } else {
    traveler_id = connection.receiver_id;
    sender_id = connection.initiator_id;
  }

  const result = await pool.query(
    `INSERT INTO chats (connection_id, traveler_id, sender_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [connection_id, traveler_id, sender_id]
  );

  return result.rows[0];
};

/* =========================
   SEND MESSAGE
========================= */
const sendMessage = async ({
  chat_id,
  sender_id,
  content,
  file_url,
  verification_stage,
}) => {
  const chatResult = await pool.query(
    'SELECT * FROM chats WHERE id = $1',
    [chat_id]
  );

  const chat = chatResult.rows[0];

  if (!chat) {
    throw new Error('Chat not found');
  }

  const isParticipant =
    chat.traveler_id === sender_id || chat.sender_id === sender_id;

  if (!isParticipant) {
    throw new Error('You are not allowed to send messages in this chat');
  }

  if (verification_stage) {
    const isTraveler = chat.traveler_id === sender_id;
    const isSender = chat.sender_id === sender_id;

    const rules = {
      pre_handover: isSender,
      handover: isSender || isTraveler,
      delivery: isTraveler,
      dispute_evidence: isSender || isTraveler,
    };

    if (!rules[verification_stage]) {
      throw new Error(`You are not allowed to upload ${verification_stage} evidence`);
    }
  }

  const message_type = file_url ? 'image' : 'text';

  const result = await pool.query(
    `INSERT INTO messages 
     (chat_id, sender_id, content, file_url, message_type, verification_stage)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      chat_id,
      sender_id,
      content || null,
      file_url || null,
      message_type,
      verification_stage || null,
    ]
  );

  return result.rows[0];
};


/* =========================
   GET MESSAGES
========================= */
const getMessages = async ({ chat_id, current_user_id }) => {
  const chatResult = await pool.query(
    'SELECT * FROM chats WHERE id = $1',
    [chat_id]
  );

  const chat = chatResult.rows[0];

  if (!chat) {
    throw new Error('Chat not found');
  }

  const isParticipant =
    chat.traveler_id === current_user_id ||
    chat.sender_id === current_user_id;

  if (!isParticipant) {
    throw new Error('You are not allowed to view messages in this chat');
  }

  const result = await pool.query(
    `SELECT messages.*, users.full_name AS sender_name
     FROM messages
     JOIN users ON messages.sender_id = users.id
     WHERE messages.chat_id = $1
     ORDER BY messages.created_at ASC`,
    [chat_id]
  );

  return result.rows;
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  createChatFromConnection,
  sendMessage,
  getMessages,
};