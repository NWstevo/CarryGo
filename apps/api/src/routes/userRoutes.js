const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMe, verify } = require('../controllers/userController');

router.get('/me', authMiddleware, getMe);
router.post('/me/verification', authMiddleware, verify);

module.exports = router;
