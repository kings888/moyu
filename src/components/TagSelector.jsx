import React from 'react';
import { Tag, Space } from 'antd';

const { CheckableTag } = Tag;

const TAGS = [
  '自驾', '财经', '追星', 'NBA', '旅游', '美食', '电影', '音乐'
];

const TagSelector = ({ selectedTags, onChange }) => {
  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked 
      ? [...selectedTags, tag] 
      : selectedTags.filter(t => t !== tag);
    onChange(nextSelectedTags);
  };

  return (
    <Space size={[0, 8]} wrap>
      {TAGS.map(tag => (
        <CheckableTag
          key={tag}
          checked={selectedTags.includes(tag)}
          onChange={checked => handleTagChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
    </Space>
  );
};

export default TagSelector; 