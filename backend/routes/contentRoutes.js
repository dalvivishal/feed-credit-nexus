
const express = require('express');
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContent);

// Protected routes
router.use(protect);
router.post('/', contentController.createContent);
router.post('/:id/save', contentController.saveContent);
router.delete('/:id/unsave', contentController.unsaveContent);
router.post('/:id/flag', contentController.flagContent);
router.post('/:id/share', contentController.shareContent);

module.exports = router;
