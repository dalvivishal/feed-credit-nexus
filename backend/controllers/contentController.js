
const Content = require('../models/contentModel');
const Transaction = require('../models/transactionModel');
const Report = require('../models/reportModel');
const User = require('../models/userModel');

// Get all content with filtering
exports.getAllContent = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { status: 'active' }; // Only return active content
    
    // Filter by content type
    if (req.query.type) {
      queryObj.contentType = req.query.type;
    }
    
    // Filter by difficulty
    if (req.query.difficulty) {
      queryObj.difficulty = req.query.difficulty;
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tagsArray = req.query.tags.split(',');
      queryObj.tags = { $in: tagsArray };
    }
    
    // Search in title, description and tags
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // Execute query
    const content = await Content.find(queryObj)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username avatar');
    
    const total = await Content.countDocuments(queryObj);
    
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

// Get a single content
exports.getContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('flags.userId', 'username');
    
    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};

// Create new content
exports.createContent = async (req, res, next) => {
  try {
    // Add the current user as creator
    req.body.createdBy = req.user.id;
    
    const content = await Content.create(req.body);
    
    // Award credits for content creation
    const user = await User.findById(req.user.id);
    user.credits += 20;
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      amount: 20,
      type: 'credit',
      description: 'Created new content',
      reference: 'content_creation',
      contentId: content._id
    });
    
    res.status(201).json({
      status: 'success',
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};

// Save content
exports.saveContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }
    
    // Check if already saved
    if (content.savedBy.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Content already saved'
      });
    }
    
    // Add user to saved list
    content.savedBy.push(req.user.id);
    await content.save();
    
    // Award credits
    const user = await User.findById(req.user.id);
    user.credits += 5;
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      amount: 5,
      type: 'credit',
      description: 'Saved content',
      reference: 'content_save',
      contentId: content._id
    });
    
    res.status(200).json({
      status: 'success',
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};

// Unsave content
exports.unsaveContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }
    
    // Check if saved
    if (!content.savedBy.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Content not saved'
      });
    }
    
    // Remove user from saved list
    content.savedBy = content.savedBy.filter(id => id.toString() !== req.user.id.toString());
    await content.save();
    
    res.status(200).json({
      status: 'success',
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};

// Flag content
exports.flagContent = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a reason for flagging'
      });
    }
    
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }
    
    // Check if already flagged by this user
    const alreadyFlagged = content.flags.some(flag => 
      flag.userId.toString() === req.user.id.toString()
    );
    
    if (alreadyFlagged) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already flagged this content'
      });
    }
    
    // Add flag
    content.flags.push({
      userId: req.user.id,
      reason
    });
    
    // If many flags, set status to flagged
    if (content.flags.length >= 3) {
      content.status = 'flagged';
    }
    
    await content.save();
    
    // Create a report
    await Report.create({
      contentId: content._id,
      userId: req.user.id,
      reportType: reason.includes('spam') ? 'spam' : 
                  reason.includes('copyright') ? 'copyright' : 
                  reason.includes('inappropriate') ? 'inappropriate' : 'other',
      description: reason
    });
    
    res.status(200).json({
      status: 'success',
      data: { content }
    });
  } catch (err) {
    next(err);
  }
};

// Share content (simulate)
exports.shareContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }
    
    // Award credits for sharing
    const user = await User.findById(req.user.id);
    user.credits += 10;
    await user.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      amount: 10,
      type: 'credit',
      description: 'Shared content',
      reference: 'content_share',
      contentId: content._id
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Content shared successfully',
      data: {
        newCredits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};
