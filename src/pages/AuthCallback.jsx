import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // 发送消息给父窗口
      window.opener.postMessage({
        type: 'wechat_login',
        code: code
      }, window.location.origin);
      
      // 关闭当前窗口
      window.close();
    } else {
      message.error('登录失败，请重试');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      处理登录中...
    </div>
  );
};

export default AuthCallback; 