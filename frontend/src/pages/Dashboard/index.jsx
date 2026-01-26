/**
 * Ministry of Health Uganda - Main Dashboard
 * Functional, actionable dashboard - No decorative elements
 * Shows: Pending approvals, Stock warnings, Overdue items, Recent activity
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../helpers/api';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import StatusBadge from '../../components/Common/StatusBadge';
import '../../theme/moh-institutional-theme.css';

const Dashboard = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [stockWarnings, setStockWarnings] = useState([]);
    const [overdueItems, setOverdueItems] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Set empty arrays as defaults to ensure UI renders even if APIs fail
            setPendingApprovals([]);
            setStockWarnings([]);
            setOverdueItems([]);
            setRecentActivity([]);
            // Load pending approvals (GRNs, Form 76A, etc.)
            try {
                const grnResponse = await API.get('/api/stores/grn?status=pending');
                const form76aResponse = await API.get('/api/stores/form76a?status=submitted');
                const approvals = [
                    ...(grnResponse.data?.data || []).map(item => ({
                        ...item,
                        type: 'GRN',
                        link: '/stores/grn'
                    })),
                    ...(form76aResponse.data?.data?.requisitions || []).map(item => ({
                        ...item,
                        type: 'Form 76A',
                        link: '/stores/form76a'
                    }))
                ];
                setPendingApprovals(approvals.slice(0, 10));
            } catch (e) {
                console.error('Error loading approvals:', e);
            }

            // Load stock warnings
            try {
                const stockResponse = await API.get('/api/stores/ledger/low-stock');
                setStockWarnings(stockResponse.data?.data || []);
            } catch (e) {
                console.error('Error loading stock warnings:', e);
            }

            // Load overdue items (maintenance, job cards, etc.)
            try {
                const maintenanceResponse = await API.get('/api/maintenance?overdue=true');
                const jobCardsResponse = await API.get('/api/v/jobcard?overdue=true');
                const overdue = [
                    ...(maintenanceResponse.data?.data || []).map(item => ({
                        ...item,
                        type: 'Maintenance',
                        link: '/ict/maintanance'
                    })),
                    ...(jobCardsResponse.data?.data || []).map(item => ({
                        ...item,
                        type: 'Job Card',
                        link: '/fleet/jobcards'
                    }))
                ];
                setOverdueItems(overdue.slice(0, 10));
            } catch (e) {
                console.error('Error loading overdue items:', e);
            }

            // Load recent activity
            try {
                const activityResponse = await API.get('/api/stores/ledger?limit=10');
                setRecentActivity(activityResponse.data?.data || []);
            } catch (e) {
                console.error('Error loading recent activity:', e);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const approvalColumns = [
        {
            key: 'type',
            label: 'Type',
            render: (value) => <StatusBadge type="info">{value}</StatusBadge>
        },
        {
            key: 'grn_no',
            label: 'Reference Number',
            render: (value, row) => value || row.requisition_number || '-'
        },
        {
            key: 'date',
            label: 'Date',
            render: (value, row) => {
                const date = value || row.form_date || row.created_at;
                return date ? new Date(date).toLocaleDateString() : '-';
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge type={value === 'approved' ? 'success' : 'warning'}>{value || 'pending'}</StatusBadge>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(row.link)}
                >
                    Review
                </button>
            )
        }
    ];

    const stockWarningColumns = [
        {
            key: 'item_code',
            label: 'Item Code',
            sortable: true
        },
        {
            key: 'item_description',
            label: 'Description',
            sortable: true
        },
        {
            key: 'balance_on_hand',
            label: 'Current Stock',
            render: (value) => (
                <span style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {value || 0}
                </span>
            )
        },
        {
            key: 'unit_cost',
            label: 'Unit Cost',
            render: (value) => `UGX ${parseFloat(value || 0).toFixed(2)}`
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => history.push('/stores/items')}
                >
                    View Item
                </button>
            )
        }
    ];

    const overdueColumns = [
        {
            key: 'type',
            label: 'Type',
            render: (value) => <StatusBadge type="error">{value}</StatusBadge>
        },
        {
            key: 'reference',
            label: 'Reference',
            render: (value, row) => value || row.job_card_no || row.asset_code || '-'
        },
        {
            key: 'due_date',
            label: 'Due Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'days_overdue',
            label: 'Days Overdue',
            render: (value, row) => {
                if (!row.due_date) return '-';
                const days = Math.floor((new Date() - new Date(row.due_date)) / (1000 * 60 * 60 * 24));
                return (
                    <span style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {days} days
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(row.link)}
                >
                    View
                </button>
            )
        }
    ];

    const activityColumns = [
        {
            key: 'transaction_date',
            label: 'Date',
            sortable: true,
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'item_description',
            label: 'Item',
            sortable: true
        },
        {
            key: 'reference_type',
            label: 'Type',
            render: (value) => {
                const typeMap = {
                    'GRN': 'success',
                    'ISSUE': 'error',
                    'RETURN': 'info',
                    'ADJUSTMENT': 'warning'
                };
                return <StatusBadge type={typeMap[value] || 'neutral'}>{value || '-'}</StatusBadge>;
            }
        },
        {
            key: 'quantity',
            label: 'Quantity',
            render: (value, row) => {
                const qty = row.quantity_received > 0 ? `+${row.quantity_received}` : `-${row.quantity_issued}`;
                return (
                    <span style={{
                        color: row.quantity_received > 0 ? 'var(--color-success)' : 'var(--color-error)',
                        fontWeight: 'var(--font-weight-semibold)'
                    }}>
                        {qty}
                    </span>
                );
            }
        },
        {
            key: 'balance_on_hand',
            label: 'Balance',
            sortable: true
        }
    ];

    // Always render the dashboard, even if data is empty
    return (
        <div style={{ minHeight: '400px' }}>
            {/* Uganda Flag Stripe */}
            <div style={{
                height: '6px',
                background: 'linear-gradient(to right, var(--uganda-black) 0%, var(--uganda-black) 33.33%, var(--uganda-yellow) 33.33%, var(--uganda-yellow) 66.66%, var(--uganda-red) 66.66%, var(--uganda-red) 100%)',
                marginBottom: 'var(--space-6)'
            }} />

            {/* Page Header */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)'
                }}>
                    Dashboard
                </h1>
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    margin: 0
                }}>
                    Overview of pending actions, alerts, and recent activity
                </p>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)'
            }}>
                <div className="card" style={{
                    borderLeft: '4px solid var(--color-warning)'
                }}>
                    <div className="card-body">
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Pending Approvals
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-warning)'
                        }}>
                            {pendingApprovals.length}
                        </div>
                    </div>
                </div>
                <div className="card" style={{
                    borderLeft: '4px solid var(--color-error)'
                }}>
                    <div className="card-body">
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Stock Warnings
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-error)'
                        }}>
                            {stockWarnings.length}
                        </div>
                    </div>
                </div>
                <div className="card" style={{
                    borderLeft: '4px solid var(--color-error)'
                }}>
                    <div className="card-body">
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Overdue Items
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-error)'
                        }}>
                            {overdueItems.length}
                        </div>
                    </div>
                </div>
                <div className="card" style={{
                    borderLeft: '4px solid var(--color-info)'
                }}>
                    <div className="card-body">
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Recent Activity
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-info)'
                        }}>
                            {recentActivity.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Approvals */}
            {pendingApprovals.length > 0 && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                        }}>
                            Pending Approvals
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/stores/grn')}
                        >
                            View All
                        </button>
                    </div>
                    <InstitutionalTable
                        data={pendingApprovals}
                        columns={approvalColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No pending approvals"
                    />
                </div>
            )}

            {/* Stock Warnings */}
            {stockWarnings.length > 0 && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                        }}>
                            Stock Warnings
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/stores/ledger')}
                        >
                            View All
                        </button>
                    </div>
                    <div className="card" style={{
                        borderLeft: '4px solid var(--color-error)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <div className="card-body">
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-error)',
                                fontWeight: 'var(--font-weight-semibold)'
                            }}>
                                ⚠️ {stockWarnings.length} items are running low on stock. Please review and consider reordering.
                            </div>
                        </div>
                    </div>
                    <InstitutionalTable
                        data={stockWarnings}
                        columns={stockWarningColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No stock warnings"
                    />
                </div>
            )}

            {/* Overdue Items */}
            {overdueItems.length > 0 && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                        }}>
                            Overdue Items
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/fleet/jobcards')}
                        >
                            View All
                        </button>
                    </div>
                    <InstitutionalTable
                        data={overdueItems}
                        columns={overdueColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No overdue items"
                    />
                </div>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            margin: 0
                        }}>
                            Recent Activity
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/stores/ledger')}
                        >
                            View All
                        </button>
                    </div>
                    <InstitutionalTable
                        data={recentActivity}
                        columns={activityColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No recent activity"
                    />
                </div>
            )}

            {/* Empty State - Always show if no data */}
            {!loading && pendingApprovals.length === 0 && stockWarnings.length === 0 && 
             overdueItems.length === 0 && recentActivity.length === 0 && (
                <div className="card" style={{
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface)'
                }}>
                    <div className="card-body" style={{
                        padding: 'var(--space-8)',
                        textAlign: 'center',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-lg)',
                            marginBottom: 'var(--space-2)',
                            color: 'var(--color-text-secondary)'
                        }}>
                            No pending actions or alerts
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-sm)'
                        }}>
                            All systems are up to date. Check back later for new activity.
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="card" style={{
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface)',
                    padding: 'var(--space-8)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Loading dashboard data...
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
