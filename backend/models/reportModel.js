
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Report must belong to a user']
  },
  reportType: {
    type: String,
    enum: ['inappropriate', 'spam', 'copyright', 'misinformation', 'other'],
    required: [true, 'Report must have a type']
  },
  description: {
    type: String,
    required: [true, 'Report must have a description']
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  resolvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

// Create indexes for better performance
reportSchema.index({ contentId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
