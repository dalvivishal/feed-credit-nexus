
const express = require('express');
const creditsController = require('../controllers/creditsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/balance', creditsController.getCreditBalance);
router.post('/spend', creditsController.spendCredits);
router.post('/claim-daily', creditsController.claimDailyBonus);
router.get('/transactions', creditsController.getTransactionHistory);

module.exports = router;
