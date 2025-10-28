import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Table, Tag } from 'antd';
import { DatabaseOutlined, CarOutlined, ShopOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ModuleReports = () => {
    const [moduleData] = useState([
        {
            module: 'IT Assets',
            icon: <DatabaseOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            disposedItems: 0,
            utilizationRate: 0,
            color: '#1890ff'
        },
        {
            module: 'Fleet Management',
            icon: <CarOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            disposedItems: 0,
            utilizationRate: 0,
            color: '#52c41a'
        },
        {
            module: 'Stores Management',
            icon: <ShopOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            disposedItems: 0,
            utilizationRate: 0,
            color: '#faad14'
        },
        {
            module: 'Finance & Activities',
            icon: <FileTextOutlined />,
            totalItems: 0,
            activeItems: 0,
            maintenanceItems: 0,
            disposedItems: 0,
            utilizationRate: 0,
            color: '#722ed1'
        }
    ]);

    const [performanceData] = useState([
        {
            key: '1',
            module: 'IT Assets',
            responseTime: '120ms',
            uptime: '99.9%',
            errorRate: '0.1%',
            status: 'excellent'
        },
        {
            key: '2',
            module: 'Fleet Management',
            responseTime: '95ms',
            uptime: '99.8%',
            errorRate: '0.2%',
            status: 'excellent'
        },
        {
            key: '3',
            module: 'Stores Management',
            responseTime: '150ms',
            uptime: '99.7%',
            errorRate: '0.3%',
            status: 'good'
        },
        {
            key: '4',
            module: 'Finance & Activities',
            responseTime: '110ms',
            uptime: '99.9%',
            errorRate: '0.1%',
            status: 'excellent'
        }
    ]);

    const performanceColumns = [
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: 'Response Time',
            dataIndex: 'responseTime',
            key: 'responseTime',
        },
        {
            title: 'Uptime',
            dataIndex: 'uptime',
            key: 'uptime',
        },
        {
            title: 'Error Rate',
            dataIndex: 'errorRate',
            key: 'errorRate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'excellent' ? 'green' : status === 'good' ? 'blue' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>Module Reports</Title>
                <Text type="secondary">Detailed reports for each system module</Text>
            </div>

            {/* Module Overview Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {moduleData.map((module, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', color: module.color, marginBottom: '12px' }}>
                                    {module.icon}
                                </div>
                                <Title level={4}>{module.module}</Title>
                                
                                <Row gutter={8} style={{ marginTop: '16px' }}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Total"
                                            value={module.totalItems}
                                            valueStyle={{ fontSize: '16px', color: module.color }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Active"
                                            value={module.activeItems}
                                            valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                                        />
                                    </Col>
                                </Row>

                                <div style={{ marginTop: '12px' }}>
                                    <Text type="secondary">Utilization Rate</Text>
                                    <Progress 
                                        percent={module.utilizationRate} 
                                        size="small" 
                                        strokeColor={module.color}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Performance Metrics */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Module Performance Metrics">
                        <Table
                            dataSource={performanceData}
                            columns={performanceColumns}
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ModuleReports;
