const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken');
const { requestLogger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const monitorMiddleware = require('./middleware/monitor');

const app = express();

// 中间件顺序很重要
app.use(cors());
app.use(express.json());
app.use(requestLogger);  // 添加请求日志
app.use(monitorMiddleware);

// 连接MongoDB
mongoose.connect('mongodb://localhost/fishingsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 内容模型
const Content = mongoose.model('Content', {
  title: String,
  summary: String,
  source: {
    name: String,
    icon: String,
    url: String
  },
  tags: [String],
  createdAt: Date
});

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// 添加认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的token' });
    }
    req.user = user;
    next();
  });
};

// 保护需要认证的路由
app.get('/api/contents', authenticateToken, async (req, res) => {
  const tags = req.query.tags ? req.query.tags.split(',') : [];
  try {
    const contents = await Content.find({
      tags: { $in: tags }
    })
    .sort({ createdAt: -1 })
    .limit(20);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: '获取内容失败' });
  }
});

// 爬虫服务
async function crawlContent() {
  // 这里实现爬虫逻辑
  // 使用cheerio爬取知乎、微博等网站的内容
  // 使用AI处理和分类内容
}

// 每小时运行一次爬虫
setInterval(crawlContent, 3600000);

// 错误处理中间件放在最后
app.use(errorHandler);

// 未匹配的路由处理
app.use((req, res) => {
  res.status(404).json({ error: '未找到请求的资源' });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，准备关闭服务器');
  app.close(() => {
    console.log('服务器已关闭');
    mongoose.connection.close(false, () => {
      console.log('数据库连接已关闭');
      process.exit(0);
    });
  });
});

module.exports = app; 