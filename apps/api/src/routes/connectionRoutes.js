const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireVerifiedUser = require('../middleware/verificationMiddleware');
const { validateConnectionDeclaration } = require('../middleware/validationMiddleware');

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
router.post(
  '/trips/:tripId',
  authMiddleware,
  requireVerifiedUser,
  validateConnectionDeclaration,
  createTripConnection
);

// Request connections
router.post(
  '/requests/:requestId',
  authMiddleware,
  requireVerifiedUser,
  validateConnectionDeclaration,
  createRequestConnection
);

// Views
router.get('/sent', authMiddleware, getSentConnections);
router.get('/received', authMiddleware, getReceivedConnections);

// Status updates
router.patch('/:id/accept', authMiddleware, requireVerifiedUser, acceptConnection);
router.patch('/:id/reject', authMiddleware, rejectConnection);
router.patch('/:id/cancel', authMiddleware, cancelConnection);

module.exports = router;