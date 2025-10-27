import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Alert, Spin } from 'antd';
import {
  DatabaseOutlined,
  ToolOutlined,
  UserOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const AssetsInventoryDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 1247,
    activeAssets: 1156,
    maintenanceDue: 23,
    totalValue: 45678900,
    pendingRequisitions: 15,
    unassignedAssets: 8,
    disposedAssets: 12
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setDashboardData({
        totalAssets: 1247,
        activeAssets: 1156,
        maintenanceDue: 23,
        totalValue: 45678900,
        pendingRequisitions: 15,
        unassignedAssets: 8,
        disposedAssets: 12
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
      <Title level={3} style={{ marginBottom: '24px', color: '#1f2937' }}>Assets Inventory Dashboard</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<DatabaseOutlined />}
              title="Total Assets"
              value={dashboardData.totalAssets}
              color="#3b82f6"
              onClick={() => history.push('/ict/assets/inventory')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<CheckCircleOutlined />}
              title="Active Assets"
              value={dashboardData.activeAssets}
              color="#10b981"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ToolOutlined />}
              title="Maintenance Due"
              value={dashboardData.maintenanceDue}
              color="#f59e0b"
              onClick={() => history.push('/ict/assets/maintanance')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<DollarOutlined />}
              title="Total Value"
              value={`UGX ${(dashboardData.totalValue / 1000000).toFixed(1)}M`}
              color="#8b5cf6"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ExclamationCircleOutlined />}
              title="Pending Requisitions"
              value={dashboardData.pendingRequisitions}
              color="#ef4444"
              onClick={() => history.push('/ict/assets/requisition')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<UserOutlined />}
              title="Unassigned Assets"
              value={dashboardData.unassignedAssets}
              color="#06b6d4"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<FileTextOutlined />}
              title="Disposed Assets"
              value={dashboardData.disposedAssets}
              color="#84cc16"
              onClick={() => history.push('/ict/assets/reports')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ClockCircleOutlined />}
              title="Servers"
              value="45"
              color="#f97316"
              onClick={() => history.push('/ict/assets/servers')}
            />
          </Col>
        </Row>

        {(dashboardData.maintenanceDue > 0 || dashboardData.pendingRequisitions > 0 || dashboardData.unassignedAssets > 0) && (
          <Alert
            message="Attention Required"
            description={
              <Space direction="vertical" size="small">
                {dashboardData.maintenanceDue > 0 && (
                  <Text>• {dashboardData.maintenanceDue} assets due for maintenance</Text>
                )}
                {dashboardData.pendingRequisitions > 0 && (
                  <Text>• {dashboardData.pendingRequisitions} requisitions pending approval</Text>
                )}
                {dashboardData.unassignedAssets > 0 && (
                  <Text>• {dashboardData.unassignedAssets} assets need assignment</Text>
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
                onClick={() => history.push('/ict/assets/reports')}
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
                onClick={() => history.push('/ict/assets/add')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <DatabaseOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                <div><Text strong>Add Asset</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/ict/assets/maintanance')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <ToolOutlined style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }} />
                <div><Text strong>Schedule Maintenance</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/ict/assets/requisition/add')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '8px' }} />
                <div><Text strong>New Requisition</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/ict/assets/reports')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <FileTextOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }} />
                <div><Text strong>View Reports</Text></div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default AssetsInventoryDashboard;