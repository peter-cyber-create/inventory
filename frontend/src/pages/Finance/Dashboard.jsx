/**
 * Ministry of Health Uganda - Finance Activities Dashboard
 * Functional, actionable dashboard - No decorative elements
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../helpers/api';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import StatusBadge from '../../components/Common/StatusBadge';
import '../../theme/moh-institutional-theme.css';

const FinanceDashboard = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalActivities: 0,
        completedActivities: 0,
        pendingActivities: 0,
        pendingAccountability: 0
    });
    const [pendingAccountability, setPendingAccountability] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [flaggedUsers, setFlaggedUsers] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load activities
            const activitiesResponse = await API.get('/api/activity');
            const activities = activitiesResponse.data?.activities || [];
            
            setStats({
                totalActivities: activities.length,
                completedActivities: activities.filter(a => a.status === 'completed' || a.status === 'Completed').length,
                pendingActivities: activities.filter(a => a.status === 'pending' || a.status === 'Pending').length,
                pendingAccountability: 0 // Will be updated
            });

            // Recent activities
            setRecentActivities(activities.slice(0, 10));

            // Pending accountability
            try {
                const accountabilityResponse = await API.get('/api/reports/accountability?status=pending');
                const accountability = accountabilityResponse.data?.data || [];
                setPendingAccountability(accountability.slice(0, 10));
                setStats(prev => ({ ...prev, pendingAccountability: accountability.length }));
            } catch (e) {
                console.error('Error loading accountability:', e);
            }

            // Flagged users
            try {
                const flaggedResponse = await API.get('/api/reports/flagged');
                setFlaggedUsers(flaggedResponse.data?.data || []);
            } catch (e) {
                console.error('Error loading flagged users:', e);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const accountabilityColumns = [
        {
            key: 'user_name',
            label: 'User',
            sortable: true
        },
        {
            key: 'activity_name',
            label: 'Activity',
            sortable: true
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (value) => value ? `UGX ${parseFloat(value).toLocaleString()}` : '-'
        },
        {
            key: 'due_date',
            label: 'Due Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
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
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(`/activities/${row.activity_id}`)}
                >
                    Review
                </button>
            )
        }
    ];

    const activityColumns = [
        {
            key: 'name',
            label: 'Activity Name',
            sortable: true
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
            render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
        },
        {
            key: 'budget',
            label: 'Budget',
            render: (value) => value ? `UGX ${parseFloat(value).toLocaleString()}` : '-'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const statusMap = {
                    'completed': 'success',
                    'Completed': 'success',
                    'pending': 'warning',
                    'Pending': 'warning',
                    'cancelled': 'error',
                    'Cancelled': 'error'
                };
                return <StatusBadge type={statusMap[value] || 'neutral'}>{value || 'Unknown'}</StatusBadge>;
            }
        },
        {
            key: 'date',
            label: 'Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => history.push(`/activities/${row.id}`)}
                >
                    View
                </button>
            )
        }
    ];

    const flaggedColumns = [
        {
            key: 'user_name',
            label: 'User',
            sortable: true
        },
        {
            key: 'total_amount',
            label: 'Total Amount',
            render: (value) => value ? `UGX ${parseFloat(value).toLocaleString()}` : '-'
        },
        {
            key: 'activity_count',
            label: 'Activities',
            sortable: true
        },
        {
            key: 'flag_reason',
            label: 'Reason',
            render: (value) => value || 'Exceeds threshold'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(`/report/flagged/${row.user_id}`)}
                >
                    Review
                </button>
            )
        }
    ];

    return (
        <div>
            {/* Uganda Flag Stripe */}
            <div style={{
                height: '6px',
                background: 'linear-gradient(to right, var(--uganda-black) 0%, var(--uganda-black) 33.33%, var(--uganda-yellow) 33.33%, var(--uganda-yellow) 66.66%, var(--uganda-red) 66.66%, var(--uganda-red) 100%)',
                marginBottom: 'var(--space-6)'
            }} />

            {/* Page Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                <div>
                    <h1 style={{
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)'
                    }}>
                        Finance Activities Dashboard
                    </h1>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                    }}>
                        Manage financial activities, budgets, and reporting
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => history.push('/activities/add')}
                >
                    + Add Activity
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)'
            }}>
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
                            Total Activities
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-info)'
                        }}>
                            {stats.totalActivities}
                        </div>
                    </div>
                </div>
                <div className="card" style={{
                    borderLeft: '4px solid var(--color-success)'
                }}>
                    <div className="card-body">
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            textTransform: 'uppercase',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Completed
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-success)'
                        }}>
                            {stats.completedActivities}
                        </div>
                    </div>
                </div>
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
                            Pending
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-warning)'
                        }}>
                            {stats.pendingActivities}
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
                            Pending Accountability
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-error)'
                        }}>
                            {stats.pendingAccountability}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Accountability Alert */}
            {pendingAccountability.length > 0 && (
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
                            Pending Accountability
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/report/accountability')}
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
                                ⚠️ {pendingAccountability.length} activities require accountability review.
                            </div>
                        </div>
                    </div>
                    <InstitutionalTable
                        data={pendingAccountability}
                        columns={accountabilityColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No pending accountability"
                    />
                </div>
            )}

            {/* Flagged Users */}
            {flaggedUsers.length > 0 && (
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
                            Flagged Users
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/report/flagged')}
                        >
                            View All
                        </button>
                    </div>
                    <InstitutionalTable
                        data={flaggedUsers}
                        columns={flaggedColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No flagged users"
                    />
                </div>
            )}

            {/* Recent Activities */}
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
                        Recent Activities
                    </h2>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => history.push('/activities/listing')}
                    >
                        View All
                    </button>
                </div>
                <InstitutionalTable
                    data={recentActivities}
                    columns={activityColumns}
                    loading={loading}
                    sortable={true}
                    pagination={false}
                    emptyMessage="No activities found"
                />
            </div>
        </div>
    );
};

export default FinanceDashboard;
