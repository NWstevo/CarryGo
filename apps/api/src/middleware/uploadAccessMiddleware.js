const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

const uploadAccessMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required to access uploads'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const filePath = req.path.split('/').pop();
      const messageResult = await pool.query(
        `SELECT m.*, c.traveler_id, c.sender_id
         FROM messages m
         JOIN chats c ON m.chat_id = c.id
         WHERE m.file_url LIKE $1`,
        [`%${filePath}%`]
      );

      if (messageResult.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      const message = messageResult.rows[0];
      const isAuthorized =
        message.sender_id === decoded.id ||
        message.traveler_id === decoded.id;

      if (!isAuthorized) {
        return res.status(403).json({
          message: 'You do not have permission to access this file'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = uploadAccessMiddleware;
