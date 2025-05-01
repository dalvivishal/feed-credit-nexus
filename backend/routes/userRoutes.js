
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile/:id', userController.getUserProfile);
router.patch('/profile', userController.updateProfile);
router.get('/transactions', userController.getUserTransactions);
router.get('/saved-content', userController.getUserSavedContent);
router.delete('/delete-account', userController.deleteAccount);

module.exports = router;
