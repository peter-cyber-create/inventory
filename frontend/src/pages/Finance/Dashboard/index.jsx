import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Alert, Spin } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const FinanceDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalBudget: 288000000,
    spentBudget: 216000000,
    remainingBudget: 72000000,
    pendingApprovals: 15,
    totalActivities: 234,
    completedActivities: 189,
    totalParticipants: 1247,
    flaggedUsers: 8
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setDashboardData({
        totalBudget: 288000000,
        spentBudget: 216000000,
        remainingBudget: 72000000,
        pendingApprovals: 15,
        totalActivities: 234,
        completedActivities: 189,
        totalParticipants: 1247,
        flaggedUsers: 8
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, suffix, onClick }) => (
    <Card 
      hoverable={onClick}
      onClick={onClick}
      style={{ 
        borderRadius: '12px',
        border: `2px solid ${color}20`,
        transition: 'all 0.3s',
        cursor: onClick ? 'pointer' : 'default'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ fontSize: '28px', color }}>{icon}</div>
        <Statistic
          title={<Text type="secondary" style={{ fontSize: '12px' }}>{title}</Text>}
          value={value}
          suffix={suffix}
          valueStyle={{ color: '#1f2937', fontSize: '24px', fontWeight: 600 }}
        />
      </Space>
    </Card>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: '24px', color: '#1f2937' }}>Finance & Activities Dashboard</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<DollarOutlined />}
              title="Total Budget"
              value={`UGX ${(dashboardData.totalBudget / 1000000).toFixed(1)}M`}
              color="#3b82f6"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<BarChartOutlined />}
              title="Spent Budget"
              value={`UGX ${(dashboardData.spentBudget / 1000000).toFixed(1)}M`}
              color="#10b981"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<PieChartOutlined />}
              title="Remaining Budget"
              value={`UGX ${(dashboardData.remainingBudget / 1000000).toFixed(1)}M`}
              color="#f59e0b"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ExclamationCircleOutlined />}
              title="Pending Approvals"
              value={dashboardData.pendingApprovals}
              color="#ef4444"
              onClick={() => history.push('/finance/activities')}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<FileTextOutlined />}
              title="Total Activities"
              value={dashboardData.totalActivities}
              color="#8b5cf6"
              onClick={() => history.push('/finance/activities')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<CheckCircleOutlined />}
              title="Completed Activities"
              value={dashboardData.completedActivities}
              color="#06b6d4"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<UserOutlined />}
              title="Total Participants"
              value={dashboardData.totalParticipants}
              color="#84cc16"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ClockCircleOutlined />}
              title="Flagged Users"
              value={dashboardData.flaggedUsers}
              color="#f97316"
              onClick={() => history.push('/finance/reports/flaggedusers')}
            />
          </Col>
        </Row>

        {(dashboardData.pendingApprovals > 0 || dashboardData.flaggedUsers > 0) && (
          <Alert
            message="Attention Required"
            description={
              <Space direction="vertical" size="small">
                {dashboardData.pendingApprovals > 0 && (
                  <Text>• {dashboardData.pendingApprovals} transactions pending approval</Text>
                )}
                {dashboardData.flaggedUsers > 0 && (
                  <Text>• {dashboardData.flaggedUsers} users flagged for review</Text>
                )}
              </Space>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '24px', borderRadius: '12px' }}
            action={
              <Text 
                type="secondary" 
                style={{ cursor: 'pointer' }}
                onClick={() => history.push('/finance/reports')}
              >
                View Details
              </Text>
            }
          />
        )}

        <Card title={<Text strong style={{ fontSize: '16px' }}>Quick Actions</Text>} style={{ borderRadius: '12px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/finance/activities')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <FileTextOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                <div><Text strong>View Activities</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/finance/users')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <UserOutlined style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }} />
                <div><Text strong>Manage Users</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/finance/reports')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '8px' }} />
                <div><Text strong>View Reports</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/finance/activity')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }} />
                <div><Text strong>Activity Details</Text></div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default FinanceDashboard;