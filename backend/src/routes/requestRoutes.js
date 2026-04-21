const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { createRequest, getRequests } = require('../controllers/requestController');

router.post('/', authMiddleware, validateRequest, createRequest);
router.get('/', getRequests);

module.exports = router;