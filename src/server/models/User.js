const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true
  },
  nickname: String,
  avatar: String,
  tags: [String],
  tagWeights: {
    type: Map,
    of: Number,
    default: {}
  },
  preferences: {
    autoRefresh: {
      type: Boolean,
      default: true
    },
    refreshInterval: {
      type: Number,
      default: 600 // 10分钟
    },
    contentLayout: {
      type: String,
      enum: ['grid', 'list'],
      default: 'grid'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: Date
});

// 添加用户交互历史
userSchema.add({
  history: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    },
    interactionType: String,
    timestamp: Date
  }]
});

module.exports = mongoose.model('User', userSchema); 