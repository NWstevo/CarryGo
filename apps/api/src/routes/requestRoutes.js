const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireVerifiedUser = require('../middleware/verificationMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { createRequest, getRequests } = require('../controllers/requestController');

router.post('/', authMiddleware, requireVerifiedUser, validateRequest, createRequest);
router.get('/', getRequests);

module.exports = router;