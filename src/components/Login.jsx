import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { WechatOutlined } from '@ant-design/icons';

const Login = ({ onLogin }) => {
  useEffect(() => {
    // 加载微信JS-SDK
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
    document.body.appendChild(script);

    script.onload = () => {
      window.wx.config({
        debug: false,
        appId: process.env.REACT_APP_WECHAT_APP_ID,
        timestamp: new Date().getTime(),
        nonceStr: 'random_nonce_str',
        signature: '',  // 需要从后端获取签名
        jsApiList: ['checkJsApi', 'onMenuShareTimeline']
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleWechatLogin = () => {
    // 使用微信扫码登录
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const scope = 'snsapi_userinfo';
    const state = 'STATE'; // 可以是随机字符串

    const authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${
      process.env.REACT_APP_WECHAT_APP_ID
    }&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

    // 打开微信登录窗口
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      authUrl,
      '微信登录',
      `width=${width},height=${height},top=${top},left=${left},menubar=0,toolbar=0,status=0,scrollbars=1,resizable=0`
    );

    // 监听登录成功消息
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'wechat_login' && event.data.code) {
        try {
          const response = await fetch('/api/wechat-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: event.data.code })
          });

          const data = await response.json();
          if (data.success) {
            // 保存token
            localStorage.setItem('token', data.token);
            // 更新用户状态
            onLogin(data.user);
            message.success('登录成功！');
          } else {
            message.error(data.error || '登录失败，请重试');
          }
        } catch (error) {
          message.error('登录失败，请重试');
        }
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>摸鱼时刻</h2>
        <p>工作之余，放松一下</p>
        <Button 
          type="primary" 
          icon={<WechatOutlined />}
          size="large"
          onClick={handleWechatLogin}
          className="wechat-login-btn"
        >
          微信登录
        </Button>
      </div>
    </div>
  );
};

export default Login; 