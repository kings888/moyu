const mongoose = require('mongoose');
const Content = require('../models/Content');
const User = require('../models/User');

class AnalyticsService {
  async trackUserInteraction(userId, contentId, action) {
    try {
      // 记录用户行为
      await User.findByIdAndUpdate(userId, {
        $push: {
          history: {
            contentId,
            interactionType: action,
            timestamp: new Date()
          }
        }
      });

      // 更新内容统计
      await Content.findByIdAndUpdate(contentId, {
        $inc: {
          [`stats.${action}Count`]: 1,
          viewCount: action === 'view' ? 1 : 0
        }
      });
    } catch (error) {
      console.error('记录用户行为失败:', error);
    }
  }

  async getContentStats(contentId) {
    try {
      const stats = await Content.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(contentId) } },
        {
          $project: {
            viewCount: 1,
            'stats.likeCount': 1,
            'stats.shareCount': 1,
            'stats.saveCount': 1
          }
        }
      ]);
      return stats[0] || null;
    } catch (error) {
      console.error('获取内容统计失败:', error);
      return null;
    }
  }

  async getUserAnalytics(userId) {
    try {
      const analytics = await User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'contents',
            localField: 'history.contentId',
            foreignField: '_id',
            as: 'interactedContent'
          }
        },
        {
          $project: {
            totalInteractions: { $size: '$history' },
            tagDistribution: '$tagWeights',
            interactionsByType: {
              $reduce: {
                input: '$history',
                initialValue: { view: 0, like: 0, share: 0, save: 0 },
                in: {
                  $mergeObjects: [
                    '$$value',
                    { ['$$this.interactionType']: { $add: ['$$value.$$this.interactionType', 1] } }
                  ]
                }
              }
            }
          }
        }
      ]);
      return analytics[0] || null;
    } catch (error) {
      console.error('获取用户统计失败:', error);
      return null;
    }
  }
}

module.exports = new AnalyticsService(); 