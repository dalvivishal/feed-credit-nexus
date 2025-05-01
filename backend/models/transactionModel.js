
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user']
  },
  amount: {
    type: Number,
    required: [true, 'Transaction must have an amount']
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: [true, 'Transaction must have a type']
  },
  description: {
    type: String,
    required: [true, 'Transaction must have a description']
  },
  reference: {
    type: String,
    enum: ['content_save', 'content_share', 'daily_login', 'admin_adjustment', 'premium_feature', 'content_creation'],
    required: [true, 'Transaction must have a reference']
  },
  contentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
transactionSchema.index({ user: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
