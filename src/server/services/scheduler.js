const cron = require('node-cron');
const crawler = require('./crawler');
const Content = require('../models/Content');

class ContentScheduler {
  constructor() {
    // 每小时执行一次爬虫
    this.crawlJob = cron.schedule('0 * * * *', () => {
      this.executeCrawling();
    });
  }

  async executeCrawling() {
    console.log('开始爬取内容...');
    
    try {
      // 并行爬取多个来源
      const [zhihuItems, weiboItems] = await Promise.all([
        crawler.crawlZhihu(),
        crawler.crawlWeibo()
      ]);

      const allItems = [...zhihuItems, ...weiboItems];
      
      // 为每个内容项添加AI分类标签
      for (const item of allItems) {
        const tags = await crawler.classifyContent(item);
        
        // 保存到数据库
        await Content.create({
          ...item,
          tags,
          createdAt: new Date()
        });
      }

      console.log(`成功爬取 ${allItems.length} 条内容`);
    } catch (error) {
      console.error('爬虫执行失败:', error);
    }
  }
}

module.exports = new ContentScheduler(); 