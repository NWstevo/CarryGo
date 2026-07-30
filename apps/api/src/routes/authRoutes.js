const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { signup, login, googleAuth } = require('../controllers/authController');
const {
  validateSignup,
  validateLogin,
  validateGoogleAuth,
} = require('../middleware/validationMiddleware');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', authLimiter, validateGoogleAuth, googleAuth);

module.exports = router;