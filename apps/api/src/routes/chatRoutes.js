const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  createChatFromConnection,
  sendMessage,
  getMessages,
} = require('../controllers/chatController');

router.post('/', authMiddleware, createChatFromConnection);

router.post(
  '/:chatId/messages',
  authMiddleware,
  upload.single('file'),
  sendMessage
);

router.get('/:chatId/messages', authMiddleware, getMessages);

module.exports = router;