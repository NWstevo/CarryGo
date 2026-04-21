const pool = require('../config/db');

const createChatForDeal = async ({ deal_id }) => {
  const dealResult = await pool.query(
    'SELECT * FROM deals WHERE id = $1',
    [deal_id]
  );

  const deal = dealResult.rows[0];

  if (!deal) {
    throw new Error('Deal not found');
  }

  const existingChat = await pool.query(
    'SELECT * FROM chats WHERE deal_id = $1',
    [deal_id]
  );

  if (existingChat.rows.length > 0) {
    return existingChat.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO chats (deal_id, traveler_id, sender_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [deal_id, deal.traveler_id, deal.sender_id]
  );

  return result.rows[0];
};

const sendMessage = async ({ chat_id, sender_id, content }) => {
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

  const result = await pool.query(
    `INSERT INTO messages (chat_id, sender_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [chat_id, sender_id, content.trim()]
  );

  return result.rows[0];
};

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
    chat.traveler_id === current_user_id || chat.sender_id === current_user_id;

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

module.exports = {
  createChatForDeal,
  sendMessage,
  getMessages,
};