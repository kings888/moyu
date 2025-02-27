const Content = require('../models/Content');
const User = require('../models/User');

class RecommendationService {
  async getPersonalizedContent(userId, limit = 20) {
    try {
      // 获取用户标签偏好
      const user = await User.findById(userId);
      const userTags = user.tags || [];

      // 基于用户标签获取内容
      const tagBasedContent = await Content.find({
        tags: { $in: userTags }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 2);

      // 获取热门内容
      const trendingContent = await Content.find({})
        .sort({ viewCount: -1 })
        .limit(limit);

      // 混合推荐结果
      const recommendedContent = this.mergeContent(
        tagBasedContent,
        trendingContent,
        limit
      );

      return recommendedContent;
    } catch (error) {
      console.error('推荐内容获取失败:', error);
      return [];
    }
  }

  mergeContent(tagBased, trending, limit) {
    // 去重
    const seen = new Set();
    const merged = [];

    // 70% 基于标签的内容
    const tagBasedLimit = Math.floor(limit * 0.7);
    for (const content of tagBased) {
      if (merged.length >= tagBasedLimit) break;
      if (!seen.has(content.id)) {
        merged.push(content);
        seen.add(content.id);
      }
    }

    // 30% 热门内容
    for (const content of trending) {
      if (merged.length >= limit) break;
      if (!seen.has(content.id)) {
        merged.push(content);
        seen.add(content.id);
      }
    }

    return merged;
  }

  async updateUserPreferences(userId, interactionType, contentId) {
    try {
      const content = await Content.findById(contentId);
      const user = await User.findById(userId);

      // 更新用户标签权重
      const tagWeights = user.tagWeights || {};
      content.tags.forEach(tag => {
        tagWeights[tag] = (tagWeights[tag] || 0) + this.getInteractionWeight(interactionType);
      });

      await User.findByIdAndUpdate(userId, {
        $set: { tagWeights }
      });
    } catch (error) {
      console.error('更新用户偏好失败:', error);
    }
  }

  getInteractionWeight(type) {
    const weights = {
      view: 1,
      like: 3,
      share: 5,
      save: 4
    };
    return weights[type] || 0;
  }
}

module.exports = new RecommendationService(); 