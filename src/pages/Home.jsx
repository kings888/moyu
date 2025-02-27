import React, { useState } from 'react';
import { Layout, Space } from 'antd';
import Login from '../components/Login';
import TagSelector from '../components/TagSelector';
import ContentFeed from '../components/ContentFeed';

const { Header, Content } = Layout;

const Home = () => {
  const [user, setUser] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Space align="center" style={{ height: '100%' }}>
          <img 
            src={user.avatar} 
            alt="avatar" 
            style={{ width: 32, height: 32, borderRadius: '50%' }} 
          />
          <span>{user.nickname}</span>
        </Space>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div className="tag-container">
          <TagSelector 
            selectedTags={selectedTags} 
            onChange={setSelectedTags} 
          />
        </div>
        <ContentFeed selectedTags={selectedTags} />
      </Content>
    </Layout>
  );
};

export default Home; 