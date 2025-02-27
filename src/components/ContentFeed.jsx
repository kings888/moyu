import React, { useEffect, useState } from 'react';
import { Card, List, Avatar } from 'antd';

const ContentFeed = ({ selectedTags }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/contents?tags=${selectedTags.join(',')}`);
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('获取内容失败:', error);
      }
    };

    fetchContent();
    // 每10分钟自动刷新
    const interval = setInterval(fetchContent, 600000);
    return () => clearInterval(interval);
  }, [selectedTags]);

  return (
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={contents}
      renderItem={item => (
        <List.Item>
          <Card title={item.title}>
            <Card.Meta
              avatar={<Avatar src={item.source.icon} />}
              title={item.source.name}
              description={item.summary}
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ContentFeed; 