import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import Login from '../Login';

// Mock antd message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login button correctly', () => {
    const { getByText } = render(<Login onLogin={mockOnLogin} />);
    expect(getByText('微信登录')).toBeInTheDocument();
  });

  it('opens WeChat login window when button is clicked', () => {
    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;

    const { getByText } = render(<Login onLogin={mockOnLogin} />);
    fireEvent.click(getByText('微信登录'));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('open.weixin.qq.com'),
      '微信登录',
      expect.any(String)
    );
  });

  it('handles successful login', async () => {
    const { getByText } = render(<Login onLogin={mockOnLogin} />);
    
    // Simulate successful WeChat login callback
    const messageData = {
      type: 'wechat_login',
      code: 'test_code'
    };

    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          user: { id: '123', name: 'Test User' },
          token: 'test_token'
        })
      })
    );

    // Trigger message event
    window.dispatchEvent(new MessageEvent('message', {
      data: messageData
    }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(
        expect.objectContaining({ id: '123', name: 'Test User' })
      );
      expect(message.success).toHaveBeenCalledWith('登录成功！');
    });
  });

  it('handles login failure', async () => {
    const { getByText } = render(<Login onLogin={mockOnLogin} />);

    // Mock fetch to simulate error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          success: false,
          error: '登录失败'
        })
      })
    );

    // Trigger login attempt
    const messageData = {
      type: 'wechat_login',
      code: 'invalid_code'
    };

    window.dispatchEvent(new MessageEvent('message', {
      data: messageData
    }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('登录失败，请重试');
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });
}); 