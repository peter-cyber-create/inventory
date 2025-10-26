import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Badge, Alert, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  WarningOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { storesService } from '../../services/storesService';

const StoresDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    pendingGRNs: 0,
    pendingRequisitions: 0,
    totalValue: 0,
    expiringItems: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await storesService.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <button 
            onClick={fetchDashboardData}
            className="ant-btn ant-btn-primary ant-btn-sm"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="stores-dashboard">
      <div className="page-header">
        <h1>Stores Dashboard</h1>
        <p>Overview of store activities and inventory status</p>
      </div>

      <Spin spinning={loading}>
        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Total Items"
                value={dashboardData.totalItems}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Low Stock Items"
                value={dashboardData.lowStockItems}
                prefix={<WarningOutlined />}
                valueStyle={{ color: dashboardData.lowStockItems > 0 ? '#ff4d4f' : '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Pending GRNs"
                value={dashboardData.pendingGRNs}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: dashboardData.pendingGRNs > 0 ? '#faad14' : '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Pending Requisitions"
                value={dashboardData.pendingRequisitions}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: dashboardData.pendingRequisitions > 0 ? '#faad14' : '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Inventory Value"
                value={formatCurrency(dashboardData.totalValue)}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic
                title="Expiring Soon"
                value={dashboardData.expiringItems}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: dashboardData.expiringItems > 0 ? '#ff4d4f' : '#52c41a' }}
                suffix="items"
              />
            </Card>
          </Col>
        </Row>

        {/* Alert Section */}
        {(dashboardData.lowStockItems > 0 || dashboardData.expiringItems > 0) && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Alert
                message="Attention Required"
                description={
                  <div>
                    {dashboardData.lowStockItems > 0 && (
                      <div>• {dashboardData.lowStockItems} items are below reorder level</div>
                    )}
                    {dashboardData.expiringItems > 0 && (
                      <div>• {dashboardData.expiringItems} items expiring within 30 days</div>
                    )}
                  </div>
                }
                type="warning"
                showIcon
              />
            </Col>
          </Row>
        )}

        {/* Quick Actions */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title="Quick Actions" 
              size="small"
              extra={
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              }
            >
              <div className="quick-actions">
                <div className="action-item">
                  <a href="/stores/receiving">Create New GRN</a>
                </div>
                <div className="action-item">
                  <a href="/stores/requisitions/new">New Requisition</a>
                </div>
                <div className="action-item">
                  <a href="/stores/items">Manage Items</a>
                </div>
                <div className="action-item">
                  <a href="/stores/stock-balance">View Stock Balance</a>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card 
              title="Recent Activity" 
              size="small"
              extra={
                <FileTextOutlined style={{ color: '#1890ff' }} />
              }
            >
              <div className="recent-activity">
                <div className="activity-item">
                  <Badge status="processing" />
                  <span>GRN pending approval</span>
                </div>
                <div className="activity-item">
                  <Badge status="warning" />
                  <span>Requisition awaiting finance approval</span>
                </div>
                <div className="activity-item">
                  <Badge status="success" />
                  <span>Items successfully issued</span>
                </div>
                <div className="activity-item">
                  <Badge status="error" />
                  <span>Low stock alert triggered</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      <style jsx>{`
        .stores-dashboard {
          padding: 24px;
        }
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .page-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #001529;
        }
        
        .page-header p {
          margin: 4px 0 0 0;
          color: #8c8c8c;
        }
        
        .quick-actions .action-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .quick-actions .action-item:last-child {
          border-bottom: none;
        }
        
        .quick-actions .action-item a {
          color: #1890ff;
          text-decoration: none;
        }
        
        .quick-actions .action-item a:hover {
          color: #40a9ff;
        }
        
        .recent-activity .activity-item {
          padding: 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .ant-statistic-content {
          font-size: 20px !important;
        }
        
        .ant-statistic-title {
          font-size: 14px !important;
          margin-bottom: 4px !important;
        }
      `}</style>
    </div>
  );
};

export default StoresDashboard;
