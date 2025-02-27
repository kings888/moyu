import React from 'react';
import { Modal, Button, Space, message } from 'antd';
import { WechatOutlined, QqOutlined, WeiboOutlined, LinkOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';

const ShareModal = ({ visible, content, onClose }) => {
  const shareUrl = `${window.location.origin}/content/${content._id}`;

  const handleWechatShare = () => {
    // 调用微信分享SDK
    window.wx.ready(() => {
      window.wx.updateAppMessageShareData({
        title: content.title,
        desc: content.summary,
        link: shareUrl,
        imgUrl: content.source.icon,
        success: () => {
          message.success('分享成功');
          onClose();
        }
      });
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      message.success('链接已复制');
      onClose();
    });
  };

  return (
    <Modal
      title="分享内容"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }} align="center">
        <QRCode value={shareUrl} size={200} />
        <Space size="large">
          <Button type="text" icon={<WechatOutlined />} onClick={handleWechatShare}>
            微信
          </Button>
          <Button type="text" icon={<QqOutlined />} href={`http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}`}>
            QQ
          </Button>
          <Button type="text" icon={<WeiboOutlined />} href={`http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}`}>
            微博
          </Button>
          <Button type="text" icon={<LinkOutlined />} onClick={handleCopyLink}>
            复制链接
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default ShareModal; 