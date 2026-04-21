const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateTrip } = require('../middleware/validationMiddleware');
const { createTrip, getTrips } = require('../controllers/tripController');

router.post('/', authMiddleware, validateTrip, createTrip);
router.get('/', getTrips);

module.exports = router;