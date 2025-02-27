const express = require('express');
const router = express.Router();
const axios = require('axios');

const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;

// 微信登录处理
router.get('/wechat-login', async (req, res) => {
  const { code } = req.query;
  
  try {
    // 获取微信access_token
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`
    );

    const { access_token, openid } = response.data;

    // 获取用户信息
    const userInfo = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`
    );

    // 创建或更新用户
    let user = await User.findOne({ openid });
    if (!user) {
      user = await User.create({
        openid,
        nickname: userInfo.data.nickname,
        avatar: userInfo.data.headimgurl,
        tags: []
      });
    }

    // 生成JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        tags: user.tags
      },
      token
    });
  } catch (error) {
    console.error('微信登录错误:', error);
    res.status(500).json({ success: false, error: '登录失败' });
  }
});

module.exports = router; 