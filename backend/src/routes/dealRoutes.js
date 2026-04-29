const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateDeal, validateDealStatus } = require('../middleware/validationMiddleware');
const { createDeal, getDeals, updateDealStatus } = require('../controllers/dealController');
const { validateDeal,validateDealStatus,} = require('../middleware/validationMiddleware');

router.post('/', authMiddleware, validateDeal, createDeal);
router.get('/', authMiddleware, getDeals);
router.patch('/:id/status', authMiddleware, validateDealStatus, updateDealStatus);

module.exports = router;
