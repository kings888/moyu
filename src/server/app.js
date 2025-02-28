const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../build')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 