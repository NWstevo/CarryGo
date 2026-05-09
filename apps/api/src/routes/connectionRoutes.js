const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createTripConnection,
  createRequestConnection,
  getSentConnections,
  getReceivedConnections,
  acceptConnection,
  rejectConnection,
  cancelConnection,
} = require('../controllers/connectionController');

// Trip connections
router.post('/trips/:tripId', authMiddleware, createTripConnection);

// Request connections
router.post('/requests/:requestId', authMiddleware, createRequestConnection);

// Views
router.get('/sent', authMiddleware, getSentConnections);
router.get('/received', authMiddleware, getReceivedConnections);

// Status updates
router.patch('/:id/accept', authMiddleware, acceptConnection);
router.patch('/:id/reject', authMiddleware, rejectConnection);
router.patch('/:id/cancel', authMiddleware, cancelConnection);

module.exports = router;