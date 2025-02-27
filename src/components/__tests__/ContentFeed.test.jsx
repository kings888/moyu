import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import ContentFeed from '../ContentFeed';

// Mock http module
jest.mock('../utils/http', () => ({
  get: jest.fn()
}));

describe('ContentFeed Component', () => {
  const mockContents = [
    {
      _id: '1',
      title: 'NBA新闻',
      summary: '篮球新闻内容',
      source: {
        name: '体育频道',
        icon: 'sports.png'
      }
    },
    {
      _id: '2',
      title: '股市分析',
      summary: '财经新闻内容',
      source: {
        name: '财经频道',
        icon: 'finance.png'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays content on mount', async () => {
    const http = require('../utils/http');
    http.get.mockResolvedValueOnce(mockContents);

    const { getByText, getAllByRole } = render(
      <ContentFeed selectedTags={['NBA', '财经']} />
    );

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith(
        '/api/contents',
        expect.any(Object)
      );
      expect(getByText('NBA新闻')).toBeInTheDocument();
      expect(getByText('股市分析')).toBeInTheDocument();
      expect(getAllByRole('listitem')).toHaveLength(2);
    });
  });

  it('refreshes content periodically', async () => {
    jest.useFakeTimers();
    const http = require('../utils/http');
    http.get.mockResolvedValue(mockContents);

    render(<ContentFeed selectedTags={['NBA']} />);

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledTimes(1);
    });

    // 快进10分钟
    act(() => {
      jest.advanceTimersByTime(600000);
    });

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it('handles fetch errors gracefully', async () => {
    const http = require('../utils/http');
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    http.get.mockRejectedValueOnce(new Error('获取失败'));

    render(<ContentFeed selectedTags={['NBA']} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('获取内容失败:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('updates content when tags change', async () => {
    const http = require('../utils/http');
    http.get.mockResolvedValue(mockContents);

    const { rerender } = render(<ContentFeed selectedTags={['NBA']} />);

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith(
        '/api/contents',
        expect.objectContaining({
          params: { tags: 'NBA' }
        })
      );
    });

    // 更新标签
    rerender(<ContentFeed selectedTags={['财经']} />);

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith(
        '/api/contents',
        expect.objectContaining({
          params: { tags: '财经' }
        })
      );
    });
  });
}); 