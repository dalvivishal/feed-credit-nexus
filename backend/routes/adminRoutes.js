
const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, adminAccess, moderatorAccess } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin-only routes
router.use('/stats', adminAccess);
router.get('/stats', adminController.getDashboardStats);

router.use('/users', adminAccess);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/users/:id/credits', adminController.adjustUserCredits);

// Moderator access routes
router.use('/reports', moderatorAccess);
router.get('/reports', adminController.getAllReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);
router.get('/flagged-content', adminController.getFlaggedContent);
router.get('/most-saved-posts', adminController.getMostSavedContent);

module.exports = router;
