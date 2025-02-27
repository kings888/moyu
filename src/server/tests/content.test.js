const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Content = require('../models/Content');
const { generateToken } = require('../utils/auth');

describe('Content API Tests', () => {
  let token;
  
  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    // 生成测试用token
    token = generateToken({ id: 'test-user-id' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await Content.deleteMany({});
  });

  describe('GET /api/contents', () => {
    it('should return filtered contents by tags', async () => {
      // 创建测试数据
      await Content.create([
        {
          title: 'NBA新闻',
          summary: '测试内容1',
          tags: ['NBA', '体育']
        },
        {
          title: '财经新闻',
          summary: '测试内容2',
          tags: ['财经']
        }
      ]);

      const response = await request(app)
        .get('/api/contents?tags=NBA,体育')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('NBA新闻');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/contents');

      expect(response.status).toBe(401);
    });
  });
}); 