
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content must have a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Content must have a description'],
      trim: true
    },
    contentType: {
      type: String,
      enum: ['article', 'video', 'course', 'resource', 'discussion'],
      required: [true, 'Content must have a type']
    },
    source: {
      type: String,
      required: [true, 'Content must have a source']
    },
    imageUrl: String,
    contentUrl: {
      type: String,
      required: [true, 'Content must have a URL']
    },
    tags: [String],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    status: {
      type: String,
      enum: ['active', 'flagged', 'removed'],
      default: 'active'
    },
    flags: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
        },
        reason: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    savedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better search performance
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ contentType: 1 });
contentSchema.index({ status: 1 });
contentSchema.index({ difficulty: 1 });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
