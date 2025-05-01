
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Get user's credit balance
exports.getCreditBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        credits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// Spend credits
exports.spendCredits = async (req, res, next) => {
  try {
    const { amount, feature } = req.body;
    
    if (!amount || !feature) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide amount and feature'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if user has enough credits
    if (user.credits < amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient credits'
      });
    }
    
    // Subtract credits
    user.credits -= amount;
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      amount,
      type: 'debit',
      description: `Used credits for ${feature}`,
      reference: 'premium_feature'
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        remainingCredits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// Daily login bonus
exports.claimDailyBonus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user already claimed bonus today
    const today = new Date().toDateString();
    
    const alreadyClaimed = await Transaction.findOne({
      user: req.user.id,
      reference: 'daily_login',
      createdAt: { 
        $gte: new Date(today), 
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000) 
      }
    });
    
    if (alreadyClaimed) {
      return res.status(400).json({
        status: 'error',
        message: 'Daily bonus already claimed today'
      });
    }
    
    // Award daily bonus
    const bonusAmount = 25;
    user.credits += bonusAmount;
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      amount: bonusAmount,
      type: 'credit',
      description: 'Daily login bonus',
      reference: 'daily_login'
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        bonusAmount,
        newBalance: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get credit transaction history
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Filter by transaction type if specified
    const filter = { user: req.user.id };
    if (req.query.type === 'credit' || req.query.type === 'debit') {
      filter.type = req.query.type;
    }
    
    const transactions = await Transaction.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('contentId', 'title');
    
    const total = await Transaction.countDocuments(filter);
    
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
