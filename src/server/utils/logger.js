const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// 日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// 创建日志目录
const logDir = path.join(__dirname, '../logs');

// 创建日志记录器
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // 错误日志
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d'
    }),
    // 应用日志
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    }),
    // 开发环境控制台输出
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ]
});

// 请求日志中间件
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // 响应结束时记录日志
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'request',
      method: req.method,
      path: req.path,
      query: req.query,
      duration,
      status: res.statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      user: req.user?.id
    });
  });

  next();
};

module.exports = {
  logger,
  requestLogger
}; 