const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    user: req.user?.id
  });

  // 区分错误类型
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: '输入数据验证失败',
      details: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: '未授权访问'
    });
  }

  // 生产环境不暴露错误详情
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd ? '服务器内部错误' : err.message,
    details: isProd ? undefined : err.stack
  });
};

module.exports = errorHandler; 