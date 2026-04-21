const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateDeal } = require('../middleware/validationMiddleware');
const { createDeal, getDeals, updateDealStatus } = require('../controllers/dealController');

router.post('/', authMiddleware, validateDeal, createDeal);
router.get('/', getDeals);
router.patch('/:id/status', authMiddleware, updateDealStatus);

module.exports = router;