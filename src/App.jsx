import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRoutes from './routes';
import http from './utils/http';
import './styles/main.css';

const App = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await http.get('/auth/check');
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setInitialized(true);
    };

    checkAuth();
  }, []);

  if (!initialized) {
    return null; // 或者显示loading
  }

  return (
    <ConfigProvider locale={zhCN}>
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App; 