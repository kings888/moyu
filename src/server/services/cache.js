const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

class CacheService {
  constructor() {
    this.redis = redis;
    this.DEFAULT_TTL = 600; // 10分钟缓存
  }

  async getContents(tags) {
    const cacheKey = `contents:${tags.sort().join(',')}`;
    
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('缓存读取失败:', error);
      return null;
    }
  }

  async setContents(tags, contents) {
    const cacheKey = `contents:${tags.sort().join(',')}`;
    
    try {
      await this.redis.setex(
        cacheKey,
        this.DEFAULT_TTL,
        JSON.stringify(contents)
      );
    } catch (error) {
      console.error('缓存写入失败:', error);
    }
  }
}

module.exports = new CacheService(); 