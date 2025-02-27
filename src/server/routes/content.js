const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const cache = require('../services/cache');
const { authenticateToken } = require('../middleware/auth');

router.get('/contents', authenticateToken, async (req, res) => {
  const tags = req.query.tags ? req.query.tags.split(',') : [];

  try {
    // 尝试从缓存获取
    const cachedContents = await cache.getContents(tags);
    if (cachedContents) {
      return res.json(cachedContents);
    }

    // 从数据库获取
    const contents = await Content.find({
      tags: { $in: tags }
    })
    .sort({ createdAt: -1 })
    .limit(20);

    // 写入缓存
    await cache.setContents(tags, contents);

    res.json(contents);
  } catch (error) {
    console.error('获取内容失败:', error);
    res.status(500).json({ error: '获取内容失败' });
  }
});

module.exports = router; 