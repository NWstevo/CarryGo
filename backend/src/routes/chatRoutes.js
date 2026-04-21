const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validationMiddleware');
const {
  createChatForDeal,
  sendMessage,
  getMessages,
} = require('../controllers/chatController');

router.post('/', authMiddleware, createChatForDeal);
router.post('/:chatId/messages', authMiddleware, validateMessage, sendMessage);
router.get('/:chatId/messages', authMiddleware, getMessages);

module.exports = router;