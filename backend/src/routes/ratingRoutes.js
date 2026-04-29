const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateRating } = require('../middleware/validationMiddleware');
const { validateRating } = require('../middleware/validationMiddleware');


const { createRating,getUserRatings,} = require('../controllers/ratingController');

router.post('/', authMiddleware, validateRating, createRating);
router.get('/users/:userId', getUserRatings);

module.exports = router;
