import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <Title level={3}>摸鱼网站</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <p>网站正在建设中...</p>
      </Content>
    </Layout>
  );
}

export default App; 