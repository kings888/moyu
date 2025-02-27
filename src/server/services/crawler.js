const axios = require('axios');
const cheerio = require('cheerio');

// 替换OpenAI配置为Deepseek配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/completions';

class ContentCrawler {
  async crawlZhihu() {
    try {
      const response = await axios.get('https://www.zhihu.com/hot', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const items = [];
      
      $('.HotItem').each((i, elem) => {
        items.push({
          title: $(elem).find('.HotItem-title').text(),
          summary: $(elem).find('.HotItem-excerpt').text(),
          source: {
            name: '知乎',
            icon: 'https://static.zhihu.com/favicon.ico',
            url: $(elem).find('a').attr('href')
          }
        });
      });
      
      return items;
    } catch (error) {
      console.error('爬取知乎失败:', error);
      return [];
    }
  }

  async crawlWeibo() {
    try {
      const response = await axios.get('https://s.weibo.com/top/summary', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const items = [];
      
      $('.data-table tbody tr').each((i, elem) => {
        items.push({
          title: $(elem).find('.td-02 a').text(),
          summary: $(elem).find('.td-03').text(),
          source: {
            name: '微博',
            icon: 'https://weibo.com/favicon.ico',
            url: 'https://s.weibo.com' + $(elem).find('.td-02 a').attr('href')
          }
        });
      });
      
      return items;
    } catch (error) {
      console.error('爬取微博失败:', error);
      return [];
    }
  }

  async classifyContent(content) {
    try {
      const prompt = `
        请分析以下内容并分配合适的标签（可多选）：
        标签选项：自驾、财经、追星、NBA、旅游、美食、电影、音乐
        内容标题：${content.title}
        内容摘要：${content.summary}
        
        请直接返回标签，用逗号分隔，不要其他文字。
      `;

      const response = await axios.post(DEEPSEEK_API_URL, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      }, {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const tags = response.data.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      return tags;
    } catch (error) {
      console.error('AI分类失败:', error);
      return [];
    }
  }
}

module.exports = new ContentCrawler(); 