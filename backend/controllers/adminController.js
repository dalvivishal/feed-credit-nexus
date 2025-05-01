
const User = require('../models/userModel');
const Content = require('../models/contentModel');
const Transaction = require('../models/transactionModel');
const Report = require('../models/reportModel');

// Admin dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const moderators = await User.countDocuments({ role: 'moderator' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Get content statistics
    const totalContent = await Content.countDocuments();
    const activeContent = await Content.countDocuments({ status: 'active' });
    const flaggedContent = await Content.countDocuments({ status: 'flagged' });
    
    // Get report statistics
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    
    // Get credit statistics
    const creditsAwarded = await Transaction.aggregate([
      { $match: { type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const creditsSpent = await Transaction.aggregate([
      { $match: { type: 'debit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get recent user registrations
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('username email createdAt');
    
    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'username');
    
    // Get recent reports
    const recentReports = await Report.find()
      .sort('-createdAt')
      .limit(5)
      .populate('userId', 'username')
      .populate('contentId', 'title');
    
    res.status(200).json({
      status: 'success',
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          moderators,
          admins
        },
        content: {
          total: totalContent,
          active: activeContent,
          flagged: flaggedContent
        },
        reports: {
          pending: pendingReports,
          resolved: resolvedReports
        },
        credits: {
          awarded: creditsAwarded.length ? creditsAwarded[0].total : 0,
          spent: creditsSpent.length ? creditsSpent[0].total : 0
        },
        recent: {
          users: recentUsers,
          transactions: recentTransactions,
          reports: recentReports
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Filter users based on query parameters
    const filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.search) {
      filter.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .sort(req.query.sort || '-createdAt')
      .skip(skip)
      .limit(limit)
      .select('-password');
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      data: { users }
    });
  } catch (err) {
    next(err);
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true
      }
    );
    
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

// Update user status (admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
    
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

// Adjust user credits (admin only)
exports.adjustUserCredits = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    const { id } = req.params;
    
    if (!amount || !reason) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide amount and reason'
      });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Update credits
    user.credits += parseInt(amount);
    if (user.credits < 0) user.credits = 0; // Prevent negative credits
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: id,
      amount: Math.abs(parseInt(amount)),
      type: amount >= 0 ? 'credit' : 'debit',
      description: reason,
      reference: 'admin_adjustment'
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
        adjustment: amount,
        newBalance: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all reports
exports.getAllReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Filter reports based on query parameters
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.reportType) {
      filter.reportType = req.query.reportType;
    }
    
    const reports = await Report.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username')
      .populate('contentId', 'title description status')
      .populate('resolvedBy', 'username');
    
    const total = await Report.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: reports.length,
      total,
      data: { reports }
    });
  } catch (err) {
    next(err);
  }
};

// Resolve a report
exports.resolveReport = async (req, res, next) => {
  try {
    const { resolution, action } = req.body;
    const { id } = req.params;
    
    if (!resolution || !action) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide resolution and action'
      });
    }
    
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }
    
    if (report.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Report already processed'
      });
    }
    
    // Update report status
    report.status = 'resolved';
    report.resolution = resolution;
    report.resolvedBy = req.user.id;
    report.resolvedAt = Date.now();
    await report.save();
    
    // Handle content based on action
    if (report.contentId) {
      const content = await Content.findById(report.contentId);
      
      if (content) {
        if (action === 'remove') {
          content.status = 'removed';
          await content.save();
        } else if (action === 'restore') {
          content.status = 'active';
          await content.save();
        }
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: { report }
    });
  } catch (err) {
    next(err);
  }
};

// Get flagged content
exports.getFlaggedContent = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    const content = await Content.find({ status: 'flagged' })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('flags.userId', 'username');
    
    const total = await Content.countDocuments({ status: 'flagged' });
    
    res.status(200).json({
      status: 'success',
      results: content.length,
      total,
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};
