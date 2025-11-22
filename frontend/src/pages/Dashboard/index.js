import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Alert, Tag } from 'antd';
import { 
    DesktopOutlined, 
    CarOutlined, 
    ShopOutlined, 
    FileTextOutlined,
    DollarCircleOutlined
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

    const StatCard = ({ icon, title, value, color, onClick }) => (
        <Card 
            hoverable
            onClick={onClick}
            style={{ 
                borderRadius: '12px',
                border: `2px solid ${color}20`,
                transition: 'all 0.3s',
                cursor: 'pointer'
            }}
            bodyStyle={{ padding: '24px' }}
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ fontSize: '32px', color }}>{icon}</div>
                <Statistic
                    title={<Text type="secondary" style={{ fontSize: '13px' }}>{title}</Text>}
                    value={value}
                    valueStyle={{ 
                        color: '#1f2937', 
                        fontSize: '32px', 
                        fontWeight: 600 
                    }}
                />
            </Space>
        </Card>
    );

    const ModuleCard = ({ icon, title, description, color, path }) => (
        <Card
            hoverable
            onClick={() => history.push(path)}
            style={{
                borderRadius: '12px',
                border: `2px solid ${color}20`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                height: '100%'
            }}
            bodyStyle={{ padding: '28px 24px', textAlign: 'center' }}
        >
            <div style={{ fontSize: '40px', color, marginBottom: '16px' }}>{icon}</div>
            <Title level={4} style={{ margin: '12px 0 8px 0', color: '#1f2937' }}>{title}</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>{description}</Text>
        </Card>
    );

    return (
        <div style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh' }}>
            {/* Page Header */}
            <div style={{ 
                marginBottom: '32px',
                textAlign: 'center'
            }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    Ministry of Health Uganda
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Inventory Management System
                </Text>
            </div>

            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        icon={<DesktopOutlined />}
                        title="Total Assets"
                        value={stats.totalAssets}
                        color="#3b82f6"
                        onClick={() => history.push('/ict/assets')}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        icon={<CarOutlined />}
                        title="Total Vehicles"
                        value={stats.totalVehicles}
                        color="#10b981"
                        onClick={() => history.push('/fleet/vehicles')}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        icon={<ShopOutlined />}
                        title="Total Products"
                        value={stats.totalProducts}
                        color="#f59e0b"
                        onClick={() => history.push('/stores')}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        icon={<DollarCircleOutlined />}
                        title="Total Value"
                        value={`UGX ${(stats.totalValue / 1000000).toFixed(1)}M`}
                        color="#8b5cf6"
                        onClick={() => history.push('/dashboard')}
                    />
                </Col>
            </Row>

            {/* Module Navigation */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <ModuleCard
                        icon={<DesktopOutlined />}
                        title="IT & Assets"
                        description="Manage IT assets, inventory, and maintenance"
                        color="#3b82f6"
                        path="/ict/assets"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ModuleCard
                        icon={<CarOutlined />}
                        title="Fleet"
                        description="Vehicle management and maintenance"
                        color="#10b981"
                        path="/fleet/dashboard"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ModuleCard
                        icon={<ShopOutlined />}
                        title="Stores"
                        description="Product management and inventory"
                        color="#f59e0b"
                        path="/stores"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ModuleCard
                        icon={<FileTextOutlined />}
                        title="Activities"
                        description="Reports and activities"
                        color="#8b5cf6"
                        path="/activities/listing"
                    />
                </Col>
            </Row>

            {/* Important Alerts */}
            <Card 
                title={<Text strong style={{ fontSize: '16px' }}>Attention Required</Text>}
                style={{ borderRadius: '12px', marginBottom: '24px' }}
                bodyStyle={{ padding: '20px' }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {stats.pendingRequisitions > 0 && (
                        <Alert
                            message={
                                <Space>
                                    <Text strong>Pending Requisitions</Text>
                                    <Tag color="orange">{stats.pendingRequisitions}</Tag>
                                </Space>
                            }
                            type="warning"
                            showIcon
                            style={{ borderRadius: '8px' }}
                        />
                    )}
                    
                    {stats.maintenanceDue > 0 && (
                        <Alert
                            message={
                                <Space>
                                    <Text strong>Maintenance Due</Text>
                                    <Tag color="blue">{stats.maintenanceDue}</Tag>
                                </Space>
                            }
                            type="info"
                            showIcon
                            style={{ borderRadius: '8px' }}
                        />
                    )}
                    
                    {stats.lowStock > 0 && (
                        <Alert
                            message={
                                <Space>
                                    <Text strong>Low Stock Items</Text>
                                    <Tag color="red">{stats.lowStock}</Tag>
                                </Space>
                            }
                            type="error"
                            showIcon
                            style={{ borderRadius: '8px' }}
                        />
                    )}
                </Space>
            </Card>

            {/* Quick Actions */}
            <Card 
                title={<Text strong style={{ fontSize: '16px' }}>Quick Actions</Text>}
                style={{ borderRadius: '12px' }}
                bodyStyle={{ padding: '20px' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            size="small" 
                            hoverable
                            onClick={() => history.push('/ict/assets/add')}
                            style={{ 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                textAlign: 'center'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                            <div><Text strong>New Asset</Text></div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            size="small" 
                            hoverable
                            onClick={() => history.push('/stores/grn')}
                            style={{ 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                textAlign: 'center'
                            }}
                        >
                            <ShopOutlined style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }} />
                            <div><Text strong>New GRN</Text></div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            size="small" 
                            hoverable
                            onClick={() => history.push('/stores/form76a')}
                            style={{ 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                textAlign: 'center'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }} />
                            <div><Text strong>New Requisition</Text></div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            size="small" 
                            hoverable
                            onClick={() => history.push('/activities/listing')}
                            style={{ 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                textAlign: 'center'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '8px' }} />
                            <div><Text strong>View Reports</Text></div>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Dashboard;