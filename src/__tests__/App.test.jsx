import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../App';
import http from '../utils/http';

// Mock http module
jest.mock('../utils/http', () => ({
  get: jest.fn()
}));

// Mock components
jest.mock('../routes', () => {
  return function MockRoutes() {
    return <div data-testid="mock-routes">Routes</div>;
  };
});

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('checks auth status on mount when token exists', async () => {
    localStorage.setItem('token', 'test-token');
    http.get.mockResolvedValueOnce({ success: true });

    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(http.get).toHaveBeenCalledWith('/auth/check');
      expect(getByTestId('mock-routes')).toBeInTheDocument();
    });
  });

  it('clears token when auth check fails', async () => {
    localStorage.setItem('token', 'invalid-token');
    http.get.mockRejectedValueOnce(new Error('Auth failed'));

    render(<App />);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('renders without auth check when no token exists', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(http.get).not.toHaveBeenCalled();
      expect(getByTestId('mock-routes')).toBeInTheDocument();
    });
  });
}); 