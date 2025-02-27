import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import http from '../utils/http';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      const response = await http.get('/api/analytics/stats', {
        params: {
          startDate: dateRange[0]?.toISOString(),
          endDate: dateRange[1]?.toISOString()
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const tagDistributionConfig = {
    data: stats?.tagDistribution || [],
    angleField: 'value',
    colorField: 'tag',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}'
    }
  };

  const interactionTrendConfig = {
    data: stats?.interactionTrend || [],
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    smooth: true
  };

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <DatePicker.RangePicker onChange={setDateRange} />
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总浏览量" value={stats?.totalViews} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="活跃用户" value={stats?.activeUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="分享次数" value={stats?.totalShares} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="内容总数" value={stats?.totalContents} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="标签分布">
            <Pie {...tagDistributionConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="互动趋势">
            <Line {...interactionTrendConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 