process.env.NODE_ENV = 'test';
process.env.TEST_MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'test-secret';

// 禁用日志输出
jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn()
  },
  requestLogger: (req, res, next) => next()
})); 