const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const activeConnections = new Map();

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server, path: '/ws/chat' });

  wss.on('connection', (ws, req) => {
    let userId = null;
    let chatId = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'auth') {
          const token = message.token;

          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;

            const chatResult = await pool.query(
              'SELECT * FROM chats WHERE id = $1 AND (traveler_id = $2 OR sender_id = $2)',
              [message.chatId, userId]
            );

            if (chatResult.rows.length === 0) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  message: 'Unauthorized access to chat',
                })
              );
              ws.close(1008, 'Unauthorized');
              return;
            }

            chatId = message.chatId;
            const key = `${chatId}:${userId}`;
            activeConnections.set(key, ws);

            ws.send(
              JSON.stringify({
                type: 'auth_success',
                message: 'Connected to chat',
              })
            );
          } catch (error) {
            ws.send(
              JSON.stringify({
                type: 'error',
                message: 'Invalid token',
              })
            );
            ws.close(1008, 'Invalid token');
          }
        }

        if (message.type === 'message' && userId && chatId) {
          const sanitizeText = require('../utils/sanitize').sanitizeText;

          const result = await pool.query(
            `INSERT INTO messages
             (chat_id, sender_id, content, message_type)
             VALUES ($1, $2, $3, 'text')
             RETURNING *`,
            [chatId, userId, sanitizeText(message.content)]
          );

          const newMessage = result.rows[0];

          const chatResult = await pool.query(
            'SELECT traveler_id, sender_id FROM chats WHERE id = $1',
            [chatId]
          );

          const chat = chatResult.rows[0];

          const otherUserId =
            chat.traveler_id === userId ? chat.sender_id : chat.traveler_id;
          const otherKey = `${chatId}:${otherUserId}`;
          const senderKey = `${chatId}:${userId}`;

          const messageData = JSON.stringify({
            type: 'new_message',
            message: newMessage,
          });

          if (activeConnections.has(otherKey)) {
            activeConnections.get(otherKey).send(messageData);
          }

          if (activeConnections.has(senderKey)) {
            activeConnections.get(senderKey).send(messageData);
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Server error',
          })
        );
      }
    });

    ws.on('close', () => {
      if (userId && chatId) {
        const key = `${chatId}:${userId}`;
        activeConnections.delete(key);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
};

module.exports = setupWebSocket;
