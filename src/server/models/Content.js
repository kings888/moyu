const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  summary: String,
  source: {
    name: String,
    icon: String,
    url: String
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  stats: {
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }
  }
});

// 添加索引以提高查询性能
contentSchema.index({ tags: 1 });
contentSchema.index({ viewCount: -1 });
contentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema); 