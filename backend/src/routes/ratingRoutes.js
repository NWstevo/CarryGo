const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createRating,
  getUserRatings,
} = require('../controllers/ratingController');

router.post('/', authMiddleware, createRating);
router.get('/users/:userId', getUserRatings);

module.exports = router;