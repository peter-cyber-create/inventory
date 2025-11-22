import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space, Progress } from 'antd';
import { 
    DesktopOutlined, 
    DatabaseOutlined, 
    WarningOutlined, 
    CheckCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/Layout/PageLayout';
import StandardTable from '../../components/Common/StandardTable';
import API from '../../helpers/api';

const { Title: _Title, Text } = Typography;

const ICTDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAssets: 0,
        activeAssets: 0,
        maintenanceDue: 0,
        totalValue: 0
    });
    const [recentAssets, setRecentAssets] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch assets data
            const assetsResponse = await API.get('/api/assets');
            const assetsData = assetsResponse.data;
            
            if (assetsData.status === 'success') {
                const assets = assetsData.assets || [];
                setStats({
                    totalAssets: assets.length,
                    activeAssets: assets.filter(asset => asset.status === 'Active').length,
                    maintenanceDue: assets.filter(asset => asset.maintenance_due).length,
                    totalValue: assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
                });
                
                // Set recent assets (last 5)
                setRecentAssets(assets.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
    };

    const handleViewAsset = (asset) => {
        console.log('View asset:', asset);
        // Navigate to asset details
    };

    const handleEditAsset = (asset) => {
        console.log('Edit asset:', asset);
        // Navigate to edit asset
    };

    const handleDeleteAsset = (asset) => {
        console.log('Delete asset:', asset);
        // Delete asset
    };

    const assetColumns = [
        {
            title: 'Asset ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Serial No.',
            dataIndex: 'serialNo',
            key: 'serialNo',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'orange'}>
                    {status || 'Unknown'}
                </Tag>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
    ];

    return (
        <PageLayout
            title="ICT Assets Dashboard"
            subtitle="Manage and monitor IT assets and equipment"
        >
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Assets"
                            value={stats.totalAssets}
                            prefix={<DesktopOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Assets"
                            value={stats.activeAssets}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Maintenance Due"
                            value={stats.maintenanceDue}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Value"
                            value={stats.totalValue}
                            prefix="UGX"
                            precision={0}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Assets */}
            <StandardTable
                title="Recent Assets"
                dataSource={recentAssets}
                columns={assetColumns}
                loading={loading}
                onCreateClick={() => console.log('Create asset')}
                onViewClick={handleViewAsset}
                onEditClick={handleEditAsset}
                onDeleteClick={handleDeleteAsset}
                createButtonText="Add Asset"
                rowKey="id"
            />

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ marginTop: '24px' }}>
                <Space wrap>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add New Asset
                    </Button>
                    <Button icon={<EyeOutlined />}>
                        View All Assets
                    </Button>
                    <Button icon={<EditOutlined />}>
                        Bulk Update
                    </Button>
                    <Button>
                        Generate Report
                    </Button>
                </Space>
            </Card>
        </PageLayout>
    );
};

export default ICTDashboard;
