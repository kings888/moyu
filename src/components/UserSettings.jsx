import React, { useState } from 'react';
import { Form, Switch, Select, Button, Card, message } from 'antd';
import http from '../utils/http';

const UserSettings = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await http.put('/user/preferences', values);
      onUpdate(response.data);
      message.success('设置已更新');
    } catch (error) {
      console.error('更新设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="个性化设置">
      <Form
        initialValues={user.preferences}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="自动刷新"
          name="autoRefresh"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="刷新间隔"
          name="refreshInterval"
        >
          <Select>
            <Select.Option value={300}>5分钟</Select.Option>
            <Select.Option value={600}>10分钟</Select.Option>
            <Select.Option value={1800}>30分钟</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="内容布局"
          name="contentLayout"
        >
          <Select>
            <Select.Option value="grid">网格视图</Select.Option>
            <Select.Option value="list">列表视图</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserSettings; 