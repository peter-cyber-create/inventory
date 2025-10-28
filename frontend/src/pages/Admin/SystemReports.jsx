import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag } from 'antd';
import { BarChartOutlined, DatabaseOutlined, CarOutlined, ShopOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SystemReports = () => {
    const [systemStats] = useState({
        totalUsers: 5,
        totalAssets: 0,
        totalVehicles: 0,
        totalRequisitions: 0,
        systemUptime: 99.9,
        databaseSize: '2.5 GB',
        lastBackup: '2025-01-20 06:00:00'
    });

    const [moduleStats] = useState([
        {
            module: 'IT Assets',
            icon: <DatabaseOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            color: '#1890ff'
        },
        {
            module: 'Fleet Management',
            icon: <CarOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            color: '#52c41a'
        },
        {
            module: 'Stores Management',
            icon: <ShopOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            color: '#faad14'
        },
        {
            module: 'Finance & Activities',
            icon: <FileTextOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            color: '#722ed1'
        }
    ]);

    const [recentActivities] = useState([
        {
            key: '1',
            module: 'IT Assets',
            action: 'Asset created',
            user: 'IT Manager',
            timestamp: '2025-01-20 10:30:00',
            status: 'success'
        },
        {
            key: '2',
            module: 'Stores',
            action: 'Requisition created',
            user: 'Store Manager',
            timestamp: '2025-01-20 09:15:00',
            status: 'pending'
        },
        {
            key: '3',
            module: 'Fleet',
            action: 'Vehicle maintenance',
            user: 'Fleet Manager',
            timestamp: '2025-01-20 08:45:00',
            status: 'success'
        }
    ]);

    const activityColumns = [
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'success' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>System Reports</Title>
                <Text type="secondary">Comprehensive system overview and analytics</Text>
            </div>

            {/* System Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={systemStats.totalUsers}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="System Uptime"
                            value={systemStats.systemUptime}
                            suffix="%"
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Database Size"
                            value={systemStats.databaseSize}
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Last Backup"
                            value={systemStats.lastBackup}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Module Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={24}>
                    <Card title="Module Statistics">
                        <Row gutter={[16, 16]}>
                            {moduleStats.map((module, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <Card size="small">
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '24px', color: module.color, marginBottom: '8px' }}>
                                                {module.icon}
                                            </div>
                                            <Title level={5}>{module.module}</Title>
                                            <div style={{ marginTop: '12px' }}>
                                                <Text strong style={{ color: module.color }}>
                                                    {module.totalItems} Total
                                                </Text>
                                                <br />
                                                <Text type="secondary">
                                                    {module.activeItems} Active
                                                </Text>
                                                <br />
                                                <Text type="secondary">
                                                    {module.maintenanceItems} Maintenance
                                                </Text>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Recent System Activities">
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

export default SystemReports;
