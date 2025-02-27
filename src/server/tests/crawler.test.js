const axios = require('axios');
const cheerio = require('cheerio');
const crawler = require('../services/crawler');

// Mock axios
jest.mock('axios');

describe('Crawler Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crawlZhihu', () => {
    it('successfully crawls Zhihu content', async () => {
      // Mock 知乎页面HTML
      const mockHtml = `
        <div class="HotItem">
          <div class="HotItem-title">测试新闻标题</div>
          <div class="HotItem-excerpt">测试新闻摘要</div>
          <a href="https://zhihu.com/test">链接</a>
        </div>
      `;

      axios.get.mockResolvedValueOnce({ data: mockHtml });

      const results = await crawler.crawlZhihu();

      expect(axios.get).toHaveBeenCalledWith(
        'https://www.zhihu.com/hot',
        expect.any(Object)
      );
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        title: '测试新闻标题',
        summary: '测试新闻摘要',
        source: {
          name: '知乎',
          icon: 'https://static.zhihu.com/favicon.ico',
          url: 'https://zhihu.com/test'
        }
      });
    });

    it('handles crawling errors gracefully', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      const results = await crawler.crawlZhihu();
      expect(results).toEqual([]);
    });
  });

  describe('crawlWeibo', () => {
    it('successfully crawls Weibo content', async () => {
      // Mock 微博页面HTML
      const mockHtml = `
        <table class="data-table">
          <tbody>
            <tr>
              <td class="td-02">
                <a href="/test">微博标题</a>
              </td>
              <td class="td-03">微博内容</td>
            </tr>
          </tbody>
        </table>
      `;

      axios.get.mockResolvedValueOnce({ data: mockHtml });

      const results = await crawler.crawlWeibo();

      expect(axios.get).toHaveBeenCalledWith(
        'https://s.weibo.com/top/summary',
        expect.any(Object)
      );
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        title: '微博标题',
        summary: '微博内容',
        source: {
          name: '微博',
          icon: 'https://weibo.com/favicon.ico',
          url: expect.stringContaining('/test')
        }
      });
    });

    it('handles crawling errors gracefully', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      const results = await crawler.crawlWeibo();
      expect(results).toEqual([]);
    });
  });

  describe('classifyContent', () => {
    it('successfully classifies content using Deepseek API', async () => {
      const mockContent = {
        title: 'NBA季后赛',
        summary: '湖人vs勇士比赛精彩回顾'
      };

      axios.post.mockResolvedValueOnce({
        data: {
          choices: [{
            message: {
              content: 'NBA,体育'
            }
          }]
        }
      });

      const tags = await crawler.classifyContent(mockContent);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('deepseek'),
        expect.any(Object),
        expect.any(Object)
      );
      expect(tags).toEqual(['NBA', '体育']);
    });

    it('handles classification errors gracefully', async () => {
      axios.post.mockRejectedValueOnce(new Error('API error'));
      const tags = await crawler.classifyContent({
        title: '测试标题',
        summary: '测试内容'
      });
      expect(tags).toEqual([]);
    });
  });
}); 