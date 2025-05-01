
const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);

module.exports = router;
