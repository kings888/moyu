import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import AuthCallback from '../AuthCallback';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock antd message
jest.mock('antd', () => ({
  message: {
    error: jest.fn()
  }
}));

describe('AuthCallback Component', () => {
  const mockNavigate = jest.fn();
  const mockPostMessage = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    window.opener = { postMessage: mockPostMessage };
    window.close = mockClose;
    
    // Mock URL search params
    delete window.location;
    window.location = new URL('http://localhost/auth/callback');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful callback with code', () => {
    window.location.search = '?code=test_code';

    render(<AuthCallback />);

    expect(mockPostMessage).toHaveBeenCalledWith(
      {
        type: 'wechat_login',
        code: 'test_code'
      },
      window.location.origin
    );
    expect(mockClose).toHaveBeenCalled();
  });

  it('redirects to home and shows error when no code', () => {
    window.location.search = '';

    render(<AuthCallback />);

    expect(message.error).toHaveBeenCalledWith('登录失败，请重试');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
}); 