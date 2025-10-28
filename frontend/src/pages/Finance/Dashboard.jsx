import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space } from 'antd';
import { 
    DollarCircleOutlined, 
    FileTextOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/Layout/PageLayout';
import StandardTable from '../../components/Common/StandardTable';

const { Title, Text } = Typography;

const FinanceDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalActivities: 0,
        completedActivities: 0,
        pendingActivities: 0,
        totalBudget: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch activities data
            const activitiesResponse = await fetch('http://localhost:5000/api/activity');
            const activitiesData = await activitiesResponse.json();
            
            if (activitiesData.status === 'success') {
                const activities = activitiesData.activities || [];
                setStats({
                    totalActivities: activities.length,
                    completedActivities: activities.filter(activity => activity.status === 'completed').length,
                    pendingActivities: activities.filter(activity => activity.status === 'pending').length,
                    totalBudget: activities.reduce((sum, activity) => sum + (activity.budget || 0), 0)
                });
                
                // Set recent activities (last 5)
                setRecentActivities(activities.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
    };

    const handleViewActivity = (activity) => {
        console.log('View activity:', activity);
    };

    const handleEditActivity = (activity) => {
        console.log('Edit activity:', activity);
    };

    const handleDeleteActivity = (activity) => {
        console.log('Delete activity:', activity);
    };

    const activityColumns = [
        {
            title: 'Activity ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Activity Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (budget) => budget ? `UGX ${budget.toLocaleString()}` : 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    'completed': 'green',
                    'pending': 'orange',
                    'cancelled': 'red'
                };
                return (
                    <Tag color={colors[status] || 'default'}>
                        {status || 'Unknown'}
                    </Tag>
                );
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    return (
        <PageLayout
            title="Finance & Activities Dashboard"
            subtitle="Manage financial activities, budgets, and reporting"
        >
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Activities"
                            value={stats.totalActivities}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={stats.completedActivities}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pendingActivities}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Budget"
                            value={stats.totalBudget}
                            prefix="UGX"
                            precision={0}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities */}
            <StandardTable
                title="Recent Activities"
                dataSource={recentActivities}
                columns={activityColumns}
                loading={loading}
                onCreateClick={() => console.log('Create activity')}
                onViewClick={handleViewActivity}
                onEditClick={handleEditActivity}
                onDeleteClick={handleDeleteActivity}
                createButtonText="Add Activity"
                rowKey="id"
            />

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ marginTop: '24px' }}>
                <Space wrap>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add New Activity
                    </Button>
                    <Button icon={<EyeOutlined />}>
                        View All Activities
                    </Button>
                    <Button icon={<DollarCircleOutlined />}>
                        Budget Report
                    </Button>
                    <Button>
                        Generate Report
                    </Button>
                </Space>
            </Card>
        </PageLayout>
    );
};

export default FinanceDashboard;
