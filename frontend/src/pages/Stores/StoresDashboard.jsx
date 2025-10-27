import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Alert, Spin, Typography } from 'antd';
import {
  ShoppingCartOutlined,
  WarningOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;

const StoresDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    pendingGRNs: 0,
    pendingRequisitions: 0,
    totalValue: 0,
    expiringItems: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await storesService.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
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

  return (
    <div style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: '24px', color: '#1f2937' }}>Stores Dashboard</Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ShoppingCartOutlined />}
              title="Total Items"
              value={dashboardData.totalItems}
              color="#f59e0b"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<WarningOutlined />}
              title="Low Stock"
              value={dashboardData.lowStockItems}
              color="#ef4444"
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<FileTextOutlined />}
              title="Pending GRNs"
              value={dashboardData.pendingGRNs}
              color="#3b82f6"
              onClick={() => history.push('/stores/grn')}
            />
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<ExclamationCircleOutlined />}
              title="Pending Requisitions"
              value={dashboardData.pendingRequisitions}
              color="#8b5cf6"
              onClick={() => history.push('/stores/form76a')}
            />
          </Col>
        </Row>

        {(dashboardData.lowStockItems > 0 || dashboardData.expiringItems > 0 || dashboardData.pendingRequisitions > 0) && (
          <Alert
            message="Attention Required"
            description={
              <Space direction="vertical" size="small">
                {dashboardData.lowStockItems > 0 && (
                  <Text>• {dashboardData.lowStockItems} items below reorder level</Text>
                )}
                {dashboardData.expiringItems > 0 && (
                  <Text>• {dashboardData.expiringItems} items expiring within 30 days</Text>
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
                onClick={() => history.push('/stores/reports')}
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
                onClick={() => history.push('/stores/grn')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <ContainerOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                <div><Text strong>New GRN</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/stores/form76a')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <FileTextOutlined style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }} />
                <div><Text strong>New Requisition</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/stores/ledger')}
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
              >
                <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '8px' }} />
                <div><Text strong>View Ledger</Text></div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                size="small" 
                hoverable
                onClick={() => history.push('/stores/reports')}
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

export default StoresDashboard;