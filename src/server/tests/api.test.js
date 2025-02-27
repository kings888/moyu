const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Content = require('../models/Content');
const { generateToken } = require('../utils/auth');

describe('API Integration Tests', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    
    // 创建测试用户
    testUser = await User.create({
      openid: 'test-openid',
      nickname: '测试用户',
      tags: ['NBA', '财经']
    });
    
    authToken = generateToken({ userId: testUser._id });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Content.deleteMany({});
  });

  describe('Content API', () => {
    it('GET /api/contents - returns filtered contents', async () => {
      // 创建测试内容
      await Content.create([
        {
          title: 'NBA新闻',
          summary: '测试内容1',
          tags: ['NBA'],
          source: { name: '体育频道' }
        },
        {
          title: '股市分析',
          summary: '测试内容2',
          tags: ['财经'],
          source: { name: '财经频道' }
        }
      ]);

      const response = await request(app)
        .get('/api/contents?tags=NBA')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('NBA新闻');
    });

    it('GET /api/contents - requires authentication', async () => {
      const response = await request(app)
        .get('/api/contents');

      expect(response.status).toBe(401);
    });
  });

  describe('User Preferences API', () => {
    it('PUT /api/user/preferences - updates user preferences', async () => {
      const newPreferences = {
        autoRefresh: false,
        refreshInterval: 300,
        contentLayout: 'list'
      };

      const response = await request(app)
        .put('/api/user/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPreferences);

      expect(response.status).toBe(200);
      expect(response.body.preferences).toMatchObject(newPreferences);

      // 验证数据库更新
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.preferences).toMatchObject(newPreferences);
    });

    it('PUT /api/user/tags - updates user tags', async () => {
      const newTags = ['旅游', '美食'];

      const response = await request(app)
        .put('/api/user/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ tags: newTags });

      expect(response.status).toBe(200);
      expect(response.body.tags).toEqual(newTags);

      // 验证数据库更新
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.tags).toEqual(newTags);
    });
  });

  describe('Analytics API', () => {
    it('GET /api/analytics/stats - returns user stats', async () => {
      const response = await request(app)
        .get('/api/analytics/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalViews');
      expect(response.body).toHaveProperty('tagDistribution');
      expect(response.body).toHaveProperty('interactionTrend');
    });
  });
}); 