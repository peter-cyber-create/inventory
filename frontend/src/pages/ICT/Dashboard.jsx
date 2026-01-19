/**
 * Ministry of Health Uganda - ICT Assets Dashboard
 * Functional, actionable dashboard - No decorative elements
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Statistic, Button, Row, Col, Alert } from 'antd';
import { DesktopOutlined, CheckCircleOutlined, WarningOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import API from '../../helpers/api';
import PageLayout from '../../components/Layout/PageLayout';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import StatusBadge from '../../components/Common/StatusBadge';
import { colors } from '../../design-system/colors';
import '../../theme/moh-institutional-theme.css';

const ICTDashboard = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAssets: 0,
        activeAssets: 0,
        maintenanceDue: 0,
        disposedAssets: 0
    });
    const [maintenanceDue, setMaintenanceDue] = useState([]);
    const [recentAssets, setRecentAssets] = useState([]);
    const [pendingRequisitions, setPendingRequisitions] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load assets
            const assetsResponse = await API.get('/api/assets');
            const assets = assetsResponse.data?.assets || [];
            
            setStats({
                totalAssets: assets.length,
                activeAssets: assets.filter(a => a.status === 'Active' || a.status === 'active').length,
                maintenanceDue: assets.filter(a => a.maintenance_due || a.next_maintenance_date).length,
                disposedAssets: assets.filter(a => a.status === 'Disposed' || a.status === 'disposed').length
            });

            // Maintenance due items
            const maintenanceItems = assets.filter(a => {
                if (a.next_maintenance_date) {
                    const dueDate = new Date(a.next_maintenance_date);
                    return dueDate <= new Date();
                }
                return a.maintenance_due;
            });
            setMaintenanceDue(maintenanceItems.slice(0, 10));

            // Recent assets
            setRecentAssets(assets.slice(0, 10));

            // Pending requisitions
            try {
                const reqResponse = await API.get('/api/requisition?status=pending');
                setPendingRequisitions(reqResponse.data?.requisitions || []);
            } catch (e) {
                console.error('Error loading requisitions:', e);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const maintenanceColumns = [
        {
            key: 'serialNo',
            label: 'Serial No.',
            sortable: true
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true
        },
        {
            key: 'next_maintenance_date',
            label: 'Due Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'Overdue'
        },
        {
            key: 'location',
            label: 'Location',
            sortable: true
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => history.push(`/ict/assets/${row.id}`)}
                    style={{ color: colors.primary, padding: 0 }}
                >
                    View Asset
                </Button>
            )
        }
    ];

    const assetColumns = [
        {
            key: 'serialNo',
            label: 'Serial No.',
            sortable: true
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true
        },
        {
            key: 'category',
            label: 'Category',
            sortable: true
        },
        {
            key: 'make',
            label: 'Make',
            sortable: true
        },
        {
            key: 'model',
            label: 'Model',
            sortable: true
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const statusMap = {
                    'Active': 'success',
                    'active': 'success',
                    'Inactive': 'warning',
                    'inactive': 'warning',
                    'Disposed': 'error',
                    'disposed': 'error'
                };
                return <StatusBadge type={statusMap[value] || 'neutral'}>{value || 'Unknown'}</StatusBadge>;
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => history.push(`/ict/assets/${row.id}`)}
                    style={{ color: colors.primary, padding: 0 }}
                >
                    View
                </Button>
            )
        }
    ];

    const requisitionColumns = [
        {
            key: 'requisition_number',
            label: 'Requisition No.',
            sortable: true
        },
        {
            key: 'date',
            label: 'Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge type="warning">{value || 'pending'}</StatusBadge>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => history.push(`/ict/requisition/${row.id}`)}
                    style={{ color: colors.primary, padding: 0 }}
                >
                    Review
                </Button>
            )
        }
    ];

    return (
        <PageLayout
            title="ICT Assets Dashboard"
            subtitle="Manage and monitor IT assets and equipment"
            extra={[
                <Button
                    key="view-all"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => history.push('/ict/assets')}
                    style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        borderRadius: '4px',
                        fontWeight: 600
                    }}
                >
                    View All Assets
                </Button>
            ]}
            loading={loading}
        >
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="institutional-card" style={{ borderLeft: `4px solid ${colors.info}` }}>
                        <Statistic
                            title="Total Assets"
                            value={stats.totalAssets}
                            prefix={<DesktopOutlined />}
                            valueStyle={{ color: colors.info }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="institutional-card" style={{ borderLeft: `4px solid ${colors.success}` }}>
                        <Statistic
                            title="Active Assets"
                            value={stats.activeAssets}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: colors.success }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="institutional-card" style={{ borderLeft: `4px solid ${colors.warning}` }}>
                        <Statistic
                            title="Maintenance Due"
                            value={stats.maintenanceDue}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: colors.warning }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="institutional-card" style={{ borderLeft: `4px solid ${colors.error}` }}>
                        <Statistic
                            title="Disposed Assets"
                            value={stats.disposedAssets}
                            prefix={<DeleteOutlined />}
                            valueStyle={{ color: colors.error }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Maintenance Due Alert */}
            {maintenanceDue.length > 0 && (
                <Card 
                    className="institutional-card"
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: colors.primary, fontSize: '16px', fontWeight: 600 }}>
                                Maintenance Due
                            </span>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => history.push('/ict/maintanance')}
                                style={{ color: colors.primary }}
                            >
                                View All
                            </Button>
                        </div>
                    }
                    style={{ 
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                        marginBottom: '24px'
                    }}
                >
                    <Alert
                        message={`${maintenanceDue.length} assets require maintenance attention.`}
                        type="warning"
                        showIcon
                        style={{ marginBottom: '16px' }}
                    />
                    <InstitutionalTable
                        data={maintenanceDue}
                        columns={maintenanceColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No maintenance due items"
                    />
                </Card>
            )}

            {/* Pending Requisitions */}
            {pendingRequisitions.length > 0 && (
                <Card 
                    className="institutional-card"
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: colors.primary, fontSize: '16px', fontWeight: 600 }}>
                                Pending Requisitions
                            </span>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => history.push('/ict/requisition')}
                                style={{ color: colors.primary }}
                            >
                                View All
                            </Button>
                        </div>
                    }
                    style={{ 
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                        marginBottom: '24px'
                    }}
                >
                    <InstitutionalTable
                        data={pendingRequisitions}
                        columns={requisitionColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No pending requisitions"
                    />
                </Card>
            )}

            {/* Recent Assets */}
            <Card 
                className="institutional-card"
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: colors.primary, fontSize: '16px', fontWeight: 600 }}>
                            Recent Assets
                        </span>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => history.push('/ict/assets')}
                            style={{ color: colors.primary }}
                        >
                            View All
                        </Button>
                    </div>
                }
                style={{ 
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)'
                }}
            >
                <InstitutionalTable
                    data={recentAssets}
                    columns={assetColumns}
                    loading={loading}
                    sortable={true}
                    pagination={false}
                    emptyMessage="No assets found"
                />
            </Card>
        </PageLayout>
    );
};

export default ICTDashboard;
