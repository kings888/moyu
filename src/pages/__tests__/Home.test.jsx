import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock子组件
jest.mock('../../components/TagSelector', () => {
  return function MockTagSelector({ selectedTags, onChange }) {
    return (
      <div data-testid="mock-tag-selector">
        <button onClick={() => onChange(['NBA'])}>选择标签</button>
      </div>
    );
  };
});

jest.mock('../../components/ContentFeed', () => {
  return function MockContentFeed({ selectedTags }) {
    return (
      <div data-testid="mock-content-feed">
        显示标签: {selectedTags.join(', ')}
      </div>
    );
  };
});

describe('Home Component', () => {
  const mockUser = {
    id: '123',
    nickname: '测试用户',
    avatar: 'test.jpg'
  };

  it('renders login page when user is not logged in', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('微信登录')).toBeInTheDocument();
  });

  it('renders main content when user is logged in', () => {
    render(
      <BrowserRouter>
        <Home initialUser={mockUser} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('mock-tag-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-content-feed')).toBeInTheDocument();
    expect(screen.getByText(mockUser.nickname)).toBeInTheDocument();
  });

  it('updates selected tags when tag selection changes', () => {
    render(
      <BrowserRouter>
        <Home initialUser={mockUser} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('选择标签'));
    expect(screen.getByText('显示标签: NBA')).toBeInTheDocument();
  });
}); 