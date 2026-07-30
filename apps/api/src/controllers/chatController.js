const chatService = require('../services/chatService');
const { sanitizeText } = require('../utils/sanitize');

/* =========================
   CREATE CHAT
========================= */
const createChatFromConnection = async (req, res, next) => {
  try {
    const chat = await chatService.createChatFromConnection({
      connection_id: req.body.connection_id,
      current_user_id: req.user.id,
    });

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

/* =========================
   SEND MESSAGE
========================= */
const sendMessage = async (req, res, next) => {
  try {
    const file_url = req.file
      ? `/uploads/chat/${req.file.filename}`
      : null;

    const message = await chatService.sendMessage({
      chat_id: req.params.chatId,
      sender_id: req.user.id,
      content: sanitizeText(req.body.content),
      file_url,
      file_type: req.file ? req.file.mimetype : null,
      verification_stage: req.body.verification_stage,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET MESSAGES
========================= */
const getMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getMessages({
      chat_id: req.params.chatId,
      current_user_id: req.user.id,
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChatFromConnection,
  sendMessage,
  getMessages,
};
