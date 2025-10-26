import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Alert, Progress, Table } from 'antd';
import { 
    DesktopOutlined, 
    CarOutlined, 
    ShopOutlined, 
    PlusOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [stats] = useState({
        totalAssets: 1247,
        totalVehicles: 89,
        totalProducts: 456,
        totalActivities: 234,
        pendingRequisitions: 23,
        maintenanceDue: 15,
        lowStock: 8,
        totalValue: 45678900
    });
    
    const history = useHistory();

    // Mock data for demonstration - in production, this would come from API
    const recentActivities = [
        {
            key: '1',
            activity: 'Asset Requisition Approved',
            user: 'John Doe',
            department: 'IT Department',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            key: '2',
            activity: 'Vehicle Maintenance Scheduled',
            user: 'Jane Smith',
            department: 'Fleet Management',
            time: '4 hours ago',
            status: 'pending'
        },
        {
            key: '3',
            activity: 'New Product Added',
            user: 'Mike Johnson',
            department: 'Stores',
            time: '6 hours ago',
            status: 'completed'
        },
        {
            key: '4',
            activity: 'Activity Report Submitted',
            user: 'Sarah Wilson',
            department: 'Finance',
            time: '8 hours ago',
            status: 'completed'
        }
    ];

    const columns = [
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (text) => <Text>{text}</Text>
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => <Text type="secondary">{text}</Text>
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (text) => <Text type="secondary">{text}</Text>
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <span>
                    {status === 'completed' ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                        <ClockCircleOutlined style={{ color: '#faad14' }} />
                    )}
                    <Text style={{ marginLeft: 8, color: status === 'completed' ? '#52c41a' : '#faad14' }}>
                        {status === 'completed' ? 'Completed' : 'Pending'}
                    </Text>
                </span>
            )
        }
    ];

    const handleModuleNavigation = (path) => {
        history.push(path);
    };

    const [loading] = useState(false);
    return (
        <div className="dashboard-container" style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Page Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                color: '#FFFFFF',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(15,23,42,0.3)'
            }}>
                <Title level={1} style={{ color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ministry of Health Uganda
                </Title>
                <Title level={3} style={{ color: '#e2e8f0', margin: '16px 0 0 0', fontWeight: 500 }}>
                    Inventory Management System Dashboard
                </Title>
                <Text style={{ color: '#cbd5e1', fontSize: '16px', opacity: 0.9 }}>
                    Comprehensive Asset, Fleet, Store, and Activity Management
                </Text>
            </div>

            {/* Quick Stats */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        className="dashboard-stat-card primary"
                        hoverable
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,23,42,0.15)';
                            e.currentTarget.style.borderColor = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Assets</Text>}
                            value={stats.totalAssets}
                            valueStyle={{ color: '#1e293b', fontSize: '28px', fontWeight: 700 }}
                            prefix={<DesktopOutlined style={{ fontSize: '24px', color: '#0f172a' }} />}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        className="dashboard-stat-card success"
                        hoverable
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,23,42,0.15)';
                            e.currentTarget.style.borderColor = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Vehicles</Text>}
                            value={stats.totalVehicles}
                            valueStyle={{ color: '#1e293b', fontSize: '28px', fontWeight: 700 }}
                            prefix={<CarOutlined style={{ fontSize: '24px', color: '#0f172a' }} />}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        className="dashboard-stat-card warning"
                        hoverable
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,23,42,0.15)';
                            e.currentTarget.style.borderColor = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Products</Text>}
                            value={stats.totalProducts}
                            valueStyle={{ color: '#1e293b', fontSize: '28px', fontWeight: 700 }}
                            prefix={<ShopOutlined style={{ fontSize: '24px', color: '#0f172a' }} />}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        className="dashboard-stat-card info"
                        hoverable
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,23,42,0.15)';
                            e.currentTarget.style.borderColor = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Activities</Text>}
                            value={stats.totalActivities}
                            valueStyle={{ color: '#1e293b', fontSize: '28px', fontWeight: 700 }}
                            prefix={<FileTextOutlined style={{ fontSize: '24px', color: '#0f172a' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Module Navigation */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable
                        onClick={() => handleModuleNavigation('/ict/assets/dashboard')}
                        style={{ 
                            borderRadius: '16px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid #e2e8f0'
                        }}
                        bodyStyle={{ padding: '32px 24px' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,23,42,0.15)';
                            e.currentTarget.style.borderColor = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <DesktopOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                        <Title level={4} style={{ margin: '16px 0 8px 0', color: '#0f172a' }}>IT & Assets</Title>
                        <Text type="secondary">Manage IT assets, inventory, and maintenance</Text>
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable
                        onClick={() => handleModuleNavigation('/fleet/dashboard')}
                        style={{ 
                            borderRadius: '16px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <CarOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                        <Title level={4} style={{ margin: '16px 0 8px 0', color: '#0f172a' }}>Fleet Management</Title>
                        <Text type="secondary">Vehicle management, maintenance, and spare parts</Text>
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable
                        onClick={() => handleModuleNavigation('/stores/dashboard')}
                        style={{ 
                            borderRadius: '16px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <ShopOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                        <Title level={4} style={{ margin: '16px 0 8px 0', color: '#0f172a' }}>Stores</Title>
                        <Text type="secondary">Product management, requisitions, and inventory</Text>
                    </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        hoverable
                        onClick={() => handleModuleNavigation('/finance/dashboard')}
                        style={{ 
                            borderRadius: '16px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <FileTextOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                        <Title level={4} style={{ margin: '16px 0 8px 0', color: '#0f172a' }}>Activities</Title>
                        <Text type="secondary">Financial activities, reports, and accountability</Text>
                    </Card>
                </Col>
            </Row>

            {/* Alerts and Notifications */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} lg={12}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0, color: '#0f172a' }}>System Alerts</Title>}
                        style={{ borderRadius: '16px' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {stats.pendingRequisitions > 0 && (
                                <Alert
                                    message={`${stats.pendingRequisitions} Pending Requisitions`}
                                    description="There are requisitions awaiting approval"
                                    type="warning"
                                    showIcon
                                    action={
                                        <Button size="small" type="link" onClick={() => handleModuleNavigation('/ict/requisition')}>
                                            View All
                                        </Button>
                                    }
                                />
                            )}
                            
                            {stats.maintenanceDue > 0 && (
                                <Alert
                                    message={`${stats.maintenanceDue} Assets Due for Maintenance`}
                                    description="Some assets require scheduled maintenance"
                                    type="info"
                                    showIcon
                                    action={
                                        <Button size="small" type="link" onClick={() => handleModuleNavigation('/ict/maintanance')}>
                                            View All
                                        </Button>
                                    }
                                />
                            )}
                            
                            {stats.lowStock > 0 && (
                                <Alert
                                    message={`${stats.lowStock} Products Low on Stock`}
                                    description="Some products need to be reordered"
                                    type="error"
                                    showIcon
                                    action={
                                        <Button size="small" type="link" onClick={() => handleModuleNavigation('/stores/products')}>
                                            View All
                                        </Button>
                                    }
                                />
                            )}
                        </Space>
                    </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0, color: '#0f172a' }}>System Overview</Title>}
                        style={{ borderRadius: '16px' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>System Health</Text>
                                <Progress percent={95} status="active" strokeColor="#52c41a" />
                            </div>
                            
                            <div>
                                <Text strong>Database Performance</Text>
                                <Progress percent={88} strokeColor="#0f172a" />
                            </div>
                            
                            <div>
                                <Text strong>Storage Usage</Text>
                                <Progress percent={67} strokeColor="#faad14" />
                            </div>
                            
                            <div style={{ marginTop: '16px' }}>
                                <Text strong>Total Asset Value</Text>
                                <Title level={3} style={{ margin: '8px 0 0 0', color: '#0f172a' }}>
                                    UGX {stats.totalValue.toLocaleString()}
                                </Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities */}
            <Card 
                title={<Title level={4} style={{ margin: 0, color: '#0f172a' }}>Recent Activities</Title>}
                style={{ borderRadius: '16px' }}
            >
                <Table 
                    columns={columns} 
                    dataSource={recentActivities} 
                    pagination={false}
                    size="middle"
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
