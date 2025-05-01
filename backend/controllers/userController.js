
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Filter out fields that are not allowed to be updated
    const filteredBody = {};
    const allowedFields = ['username', 'avatar'];
    
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user's credit transactions
exports.getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(parseInt(req.query.limit) || 20)
      .skip(parseInt(req.query.offset) || 0);
    
    const total = await Transaction.countDocuments({ user: req.user.id });
    
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      total,
      data: { transactions }
    });
  } catch (err) {
    next(err);
  }
};

// Get user's saved content
exports.getUserSavedContent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedContent',
      options: {
        sort: { createdAt: -1 },
        limit: parseInt(req.query.limit) || 20,
        skip: parseInt(req.query.offset) || 0
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      results: user.savedContent.length,
      data: { content: user.savedContent }
    });
  } catch (err) {
    next(err);
  }
};

// Delete user account (soft delete)
exports.deleteAccount = async (req, res, next) => {
  try {
    // Set user status to 'suspended' instead of actually deleting
    await User.findByIdAndUpdate(req.user.id, { status: 'suspended' });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
