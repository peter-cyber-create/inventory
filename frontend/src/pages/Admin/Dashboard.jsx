import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space } from 'antd';
import { 
    UserOutlined, 
    DatabaseOutlined, 
    CarOutlined, 
    ShopOutlined, 
    FileTextOutlined,
    SettingOutlined,
    BarChartOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminDashboard = () => {
    const history = useHistory();
    const [stats] = useState({
        totalUsers: 5,
        totalAssets: 0,
        totalVehicles: 0,
        totalRequisitions: 0,
        activeModules: 4,
        systemHealth: 95
    });

    const [recentActivities] = useState([
        {
            key: '1',
            user: 'Admin User',
            action: 'Logged in',
            module: 'System',
            time: '2 minutes ago',
            status: 'success'
        },
        {
            key: '2',
            user: 'IT Manager',
            action: 'Added new asset',
            module: 'IT Assets',
            time: '15 minutes ago',
            status: 'success'
        },
        {
            key: '3',
            user: 'Store Manager',
            action: 'Created requisition',
            module: 'Stores',
            time: '1 hour ago',
            status: 'pending'
        }
    ]);

    const moduleCards = [
        {
            title: 'IT Assets',
            description: 'Manage IT equipment and inventory',
            icon: <DatabaseOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
            path: '/ict/assets',
            stats: { total: 0, active: 0, maintenance: 0 },
            color: '#1890ff'
        },
        {
            title: 'Fleet Management',
            description: 'Vehicle tracking and maintenance',
            icon: <CarOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
            path: '/fleet/dashboard',
            stats: { total: 0, active: 0, maintenance: 0 },
            color: '#52c41a'
        },
        {
            title: 'Stores Management',
            description: 'Inventory and requisition management',
            icon: <ShopOutlined style={{ fontSize: 32, color: '#faad14' }} />,
            path: '/stores',
            stats: { total: 0, active: 0, maintenance: 0 },
            color: '#faad14'
        },
        {
            title: 'Finance & Activities',
            description: 'Financial tracking and reporting',
            icon: <FileTextOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
            path: '/activities/listing',
            stats: { total: 0, active: 0, maintenance: 0 },
            color: '#722ed1'
        }
    ];

    const quickActions = [
        {
            title: 'User Management',
            description: 'Manage system users and roles',
            icon: <UserOutlined />,
            path: '/admin/users',
            color: '#1890ff'
        },
        {
            title: 'System Settings',
            description: 'Configure system parameters',
            icon: <SettingOutlined />,
            path: '/admin/settings',
            color: '#52c41a'
        },
        {
            title: 'System Reports',
            description: 'View comprehensive system reports',
            icon: <BarChartOutlined />,
            path: '/admin/reports/overview',
            color: '#faad14'
        },
        {
            title: 'Roles & Permissions',
            description: 'Manage user roles and permissions',
            icon: <TeamOutlined />,
            path: '/admin/roles',
            color: '#722ed1'
        }
    ];

    const activityColumns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'success' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                    {status === 'success' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                    {status}
                </Tag>
            ),
        },
    ];

    const handleModuleClick = (path) => {
        history.push(path);
    };

    const handleQuickActionClick = (path) => {
        history.push(path);
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>Administration Dashboard</Title>
                <Text type="secondary">System overview and management tools</Text>
            </div>

            {/* System Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Modules"
                            value={stats.activeModules}
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="System Health"
                            value={stats.systemHealth}
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Assets"
                            value={stats.totalAssets}
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Module Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card title="Module Overview" extra={<Button type="link">View All</Button>}>
                        <Row gutter={[16, 16]}>
                            {moduleCards.map((module, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <Card
                                        hoverable
                                        onClick={() => handleModuleClick(module.path)}
                                        style={{ textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        <div style={{ marginBottom: '16px' }}>
                                            {module.icon}
                                        </div>
                                        <Title level={4} style={{ marginBottom: '8px' }}>
                                            {module.title}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {module.description}
                                        </Text>
                                        <div style={{ marginTop: '12px' }}>
                                            <Text strong style={{ color: module.color }}>
                                                {module.stats.total} Total
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions and Recent Activities */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Quick Actions" extra={<Button type="link">View All</Button>}>
                        <Row gutter={[16, 16]}>
                            {quickActions.map((action, index) => (
                                <Col xs={24} sm={12} key={index}>
                                    <Card
                                        hoverable
                                        onClick={() => handleQuickActionClick(action.path)}
                                        style={{ cursor: 'pointer' }}
                                        size="small"
                                    >
                                        <Space>
                                            <div style={{ color: action.color }}>
                                                {action.icon}
                                            </div>
                                            <div>
                                                <Text strong>{action.title}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {action.description}
                                                </Text>
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Activities" extra={<Button type="link">View All</Button>}>
                        <Table
                            dataSource={recentActivities}
                            columns={activityColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
