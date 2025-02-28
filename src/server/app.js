const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const { setupCrawler } = require('./services/crawler');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redis客户端
const redis = new Redis(process.env.REDIS_URL);

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../build')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);

// 启动爬虫服务
setupCrawler();

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 