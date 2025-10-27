import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Alert, Spin } from 'antd';
import {
  CarOutlined,
  ToolOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const FleetDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalVehicles: 89,
    activeVehicles: 75,
    maintenanceDue: 15,
    totalDrivers: 45,
    pendingRequisitions: 8,
    totalSpareParts: 234,
    totalValue: 125000000
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setDashboardData({
        totalVehicles: 89,
        activeVehicles: 75,
        maintenanceDue: 15,
        totalDrivers: 45,
        pendingRequisitions: 8,
        totalSpareParts: 234,
        totalValue: 125000000
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
      <Title level={3} style={{ marginBottom: '24px', color: '#1f2937' }}>Fleet Management Dashboard</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<CarOutlined />}
              title="Total Vehicles"
              value={dashboardData.totalVehicles}
              color="#10b981"
              onClick={() => history.push('/fleet/vehicles')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<CheckCircleOutlined />}
              title="Active Vehicles"
              value={dashboardData.activeVehicles}
              color="#3b82f6"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ToolOutlined />}
              title="Maintenance Due"
              value={dashboardData.maintenanceDue}
              color="#f59e0b"
              onClick={() => history.push('/fleet/jobcards')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<UserOutlined />}
              title="Total Drivers"
              value={dashboardData.totalDrivers}
              color="#8b5cf6"
              onClick={() => history.push('/fleet/masters/drivers')}
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
              onClick={() => history.push('/fleet/requistion')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ToolOutlined />}
              title="Spare Parts"
              value={dashboardData.totalSpareParts}
              color="#06b6d4"
              onClick={() => history.push('/fleet/spareparts')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<DollarCircleOutlined />}
              title="Fleet Value"
              value={`UGX ${(dashboardData.totalValue / 1000000).toFixed(1)}M`}
              color="#84cc16"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ClockCircleOutlined />}
              title="Service History"
              value="12"
              color="#f97316"
              onClick={() => history.push('/fleet/reports/servicehistory')}
            />
          </Col>
        </Row>

        {(dashboardData.maintenanceDue > 0 || dashboardData.pendingRequisitions > 0) && (
          <Alert
            message="Attention Required"
            description={
              <Space direction="vertical" size="small">
                {dashboardData.maintenanceDue > 0 && (
                  <Text>• {dashboardData.maintenanceDue} vehicles due for maintenance</Text>
                )}
                {dashboardData.pendingRequisitions > 0 && (
                  <Text>• {dashboardData.pendingRequisitions} requisitions pending approval</Text>
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
                onClick={() => history.push('/fleet/reports/servicehistory')}
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
                onClick={() => history.push('/fleet/vehicles')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <CarOutlined style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }} />
                <div><Text strong>Manage Vehicles</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/fleet/jobcard')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <ToolOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                <div><Text strong>New Job Card</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/fleet/requistion/add')}
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
                onClick={() => history.push('/fleet/receiving/create')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }} />
                <div><Text strong>Receive Items</Text></div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  );
};

export default FleetDashboard;