const monitor = require('../services/monitor');

const monitorMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // 记录请求
  monitor.recordRequest();

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - start;
    monitor.recordResponseTime(duration);
  });

  // 错误处理
  res.on('error', (error) => {
    monitor.recordError(error);
  });

  next();
};

module.exports = monitorMiddleware; 