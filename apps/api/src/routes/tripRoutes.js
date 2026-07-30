const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireVerifiedUser = require('../middleware/verificationMiddleware');
const { validateTrip } = require('../middleware/validationMiddleware');
const { createTrip, getTrips } = require('../controllers/tripController');

router.post('/', authMiddleware, requireVerifiedUser, validateTrip, createTrip);
router.get('/', getTrips);

module.exports = router;