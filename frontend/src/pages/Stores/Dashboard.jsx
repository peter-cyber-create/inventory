import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space, Alert } from 'antd';
import { 
    ShopOutlined, 
    InboxOutlined, 
    WarningOutlined, 
    CheckCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/Layout/PageLayout';
import StandardTable from '../../components/Common/StandardTable';
import API from '../../helpers/api';

const { Title, Text } = Typography;

const StoresDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockItems: 0,
        totalTransactions: 0,
        totalValue: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stock balances
            const balanceResponse = await API.get('/api/stores/ledger/balance');
            const balanceData = balanceResponse.data;
            
            // Fetch low stock items
            const lowStockResponse = await API.get('/api/stores/ledger/low-stock');
            const lowStockData = lowStockResponse.data;
            
            // Fetch recent transactions
            const transactionsResponse = await API.get('/api/stores/ledger');
            const transactionsData = transactionsResponse.data;
            
            if (balanceData.status === 'success') {
                const items = balanceData.data || [];
                setStats({
                    totalItems: items.length,
                    lowStockItems: lowStockData.status === 'success' ? lowStockData.data.length : 0,
                    totalTransactions: transactionsData.status === 'success' ? transactionsData.data.length : 0,
                    totalValue: items.reduce((sum, item) => sum + parseFloat(item.total_value || 0), 0)
                });
                
                setRecentTransactions(transactionsData.status === 'success' ? transactionsData.data.slice(0, 5) : []);
                setLowStockItems(lowStockData.status === 'success' ? lowStockData.data : []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
    };

    const handleViewItem = (item) => {
        console.log('View item:', item);
    };

    const handleEditItem = (item) => {
        console.log('Edit item:', item);
    };

    const handleDeleteItem = (item) => {
        console.log('Delete item:', item);
    };

    const transactionColumns = [
        {
            title: 'Date',
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            width: 100,
        },
        {
            title: 'Item Code',
            dataIndex: 'item_code',
            key: 'item_code',
            width: 100,
        },
        {
            title: 'Description',
            dataIndex: 'item_description',
            key: 'item_description',
        },
        {
            title: 'Type',
            dataIndex: 'reference_type',
            key: 'reference_type',
            render: (type) => (
                <Tag color={type === 'PURCHASE' ? 'green' : type === 'ISSUE' ? 'orange' : 'blue'}>
                    {type || 'Unknown'}
                </Tag>
            ),
        },
        {
            title: 'Qty',
            key: 'quantity',
            render: (_, record) => {
                const qty = record.quantity_received > 0 ? `+${record.quantity_received}` : `-${record.quantity_issued}`;
                return (
                    <Text style={{ color: record.quantity_received > 0 ? 'green' : 'red' }}>
                        {qty}
                    </Text>
                );
            },
        },
        {
            title: 'Balance',
            dataIndex: 'balance_on_hand',
            key: 'balance_on_hand',
        },
    ];

    const lowStockColumns = [
        {
            title: 'Item Code',
            dataIndex: 'item_code',
            key: 'item_code',
        },
        {
            title: 'Description',
            dataIndex: 'item_description',
            key: 'item_description',
        },
        {
            title: 'Current Stock',
            dataIndex: 'balance_on_hand',
            key: 'balance_on_hand',
            render: (balance) => (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {balance}
                </Text>
            ),
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unit_cost',
            key: 'unit_cost',
            render: (cost) => `UGX ${parseFloat(cost).toFixed(2)}`,
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
    ];

    return (
        <PageLayout
            title="Stores Management Dashboard"
            subtitle="Manage inventory, stock levels, and store operations"
        >
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Items"
                            value={stats.totalItems}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Low Stock Items"
                            value={stats.lowStockItems}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Transactions"
                            value={stats.totalTransactions}
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: '#52c41a' }}
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

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Alert
                    message={`${lowStockItems.length} items are running low on stock`}
                    description="Please review the low stock items below and consider reordering."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            {/* Recent Transactions */}
            <StandardTable
                title="Recent Transactions"
                dataSource={recentTransactions}
                columns={transactionColumns}
                loading={loading}
                onCreateClick={() => console.log('Create transaction')}
                onViewClick={handleViewItem}
                onEditClick={handleEditItem}
                onDeleteClick={handleDeleteItem}
                createButtonText="Add Transaction"
                rowKey="ledger_id"
            />

            {/* Low Stock Items */}
            {lowStockItems.length > 0 && (
                <StandardTable
                    title="Low Stock Items"
                    dataSource={lowStockItems}
                    columns={lowStockColumns}
                    loading={loading}
                    onCreateClick={() => console.log('Create purchase order')}
                    onViewClick={handleViewItem}
                    onEditClick={handleEditItem}
                    onDeleteClick={handleDeleteItem}
                    createButtonText="Create Purchase Order"
                    rowKey="item_code"
                    style={{ marginTop: '24px' }}
                />
            )}

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ marginTop: '24px' }}>
                <Space wrap>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add New Item
                    </Button>
                    <Button icon={<EyeOutlined />}>
                        View All Items
                    </Button>
                    <Button icon={<EditOutlined />}>
                        Stock Adjustment
                    </Button>
                    <Button>
                        Generate Report
                    </Button>
                </Space>
            </Card>
        </PageLayout>
    );
};

export default StoresDashboard;
