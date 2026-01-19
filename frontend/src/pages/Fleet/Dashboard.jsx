/**
 * Ministry of Health Uganda - Fleet Management Dashboard
 * Functional, actionable dashboard - No decorative elements
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../helpers/api';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import StatusBadge from '../../components/Common/StatusBadge';
import '../../theme/moh-institutional-theme.css';

const FleetDashboard = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeVehicles: 0,
        maintenanceDue: 0,
        overdueJobCards: 0
    });
    const [overdueJobCards, setOverdueJobCards] = useState([]);
    const [maintenanceDue, setMaintenanceDue] = useState([]);
    const [recentVehicles, setRecentVehicles] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load vehicles
            const vehiclesResponse = await API.get('/api/v/vehicle');
            const vehicles = vehiclesResponse.data?.vehicles || [];
            
            setStats({
                totalVehicles: vehicles.length,
                activeVehicles: vehicles.filter(v => v.status === 'Active' || v.status === 'active').length,
                maintenanceDue: vehicles.filter(v => v.maintenance_due || v.next_service_date).length,
                overdueJobCards: 0 // Will be updated from job cards
            });

            // Recent vehicles
            setRecentVehicles(vehicles.slice(0, 10));

            // Maintenance due vehicles
            const maintenanceVehicles = vehicles.filter(v => {
                if (v.next_service_date) {
                    const dueDate = new Date(v.next_service_date);
                    return dueDate <= new Date();
                }
                return v.maintenance_due;
            });
            setMaintenanceDue(maintenanceVehicles.slice(0, 10));

            // Overdue job cards
            try {
                const jobCardsResponse = await API.get('/api/v/jobcard?status=open');
                const jobCards = jobCardsResponse.data?.jobCards || [];
                const overdue = jobCards.filter(jc => {
                    if (jc.due_date) {
                        return new Date(jc.due_date) < new Date();
                    }
                    return false;
                });
                setOverdueJobCards(overdue.slice(0, 10));
                setStats(prev => ({ ...prev, overdueJobCards: overdue.length }));
            } catch (e) {
                console.error('Error loading job cards:', e);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const jobCardColumns = [
        {
            key: 'job_card_no',
            label: 'Job Card No.',
            sortable: true
        },
        {
            key: 'vehicle_number_plate',
            label: 'Vehicle',
            sortable: true
        },
        {
            key: 'service_type',
            label: 'Service Type',
            sortable: true
        },
        {
            key: 'due_date',
            label: 'Due Date',
            render: (value) => value ? new Date(value).toLocaleDateString() : '-'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge type="error">{value || 'overdue'}</StatusBadge>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(`/fleet/jobcards/${row.id}`)}
                >
                    View Job Card
                </button>
            )
        }
    ];

    const maintenanceColumns = [
        {
            key: 'new_number_plate',
            label: 'Number Plate',
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
            key: 'next_service_date',
            label: 'Service Due',
            render: (value) => value ? new Date(value).toLocaleDateString() : 'Overdue'
        },
        {
            key: 'mileage',
            label: 'Mileage',
            render: (value) => value ? `${value} km` : 'N/A'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => history.push(`/fleet/vehicles/${row.id}`)}
                >
                    View Vehicle
                </button>
            )
        }
    ];

    const vehicleColumns = [
        {
            key: 'new_number_plate',
            label: 'Number Plate',
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
            key: 'YOM',
            label: 'Year',
            sortable: true
        },
        {
            key: 'mileage',
            label: 'Mileage',
            render: (value) => value ? `${value} km` : 'N/A'
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
                    'Under Maintenance': 'warning',
                    'under_maintenance': 'warning'
                };
                return <StatusBadge type={statusMap[value] || 'neutral'}>{value || 'Unknown'}</StatusBadge>;
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => history.push(`/fleet/vehicles/${row.id}`)}
                >
                    View
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
                        Fleet Management Dashboard
                    </h1>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                    }}>
                        Manage vehicles, maintenance, and fleet operations
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => history.push('/fleet/vehicles')}
                >
                    View All Vehicles
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
                            Total Vehicles
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-info)'
                        }}>
                            {stats.totalVehicles}
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
                            Active Vehicles
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-success)'
                        }}>
                            {stats.activeVehicles}
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
                            Maintenance Due
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-warning)'
                        }}>
                            {stats.maintenanceDue}
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
                            Overdue Job Cards
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-error)'
                        }}>
                            {stats.overdueJobCards}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overdue Job Cards Alert */}
            {overdueJobCards.length > 0 && (
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
                            Overdue Job Cards
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/fleet/jobcards')}
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
                                ⚠️ {overdueJobCards.length} job cards are overdue and require immediate attention.
                            </div>
                        </div>
                    </div>
                    <InstitutionalTable
                        data={overdueJobCards}
                        columns={jobCardColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No overdue job cards"
                    />
                </div>
            )}

            {/* Maintenance Due */}
            {maintenanceDue.length > 0 && (
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
                            Maintenance Due
                        </h2>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => history.push('/fleet/vehicles')}
                        >
                            View All
                        </button>
                    </div>
                    <InstitutionalTable
                        data={maintenanceDue}
                        columns={maintenanceColumns}
                        loading={loading}
                        sortable={true}
                        pagination={false}
                        emptyMessage="No maintenance due vehicles"
                    />
                </div>
            )}

            {/* Recent Vehicles */}
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
                        Recent Vehicles
                    </h2>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => history.push('/fleet/vehicles')}
                    >
                        View All
                    </button>
                </div>
                <InstitutionalTable
                    data={recentVehicles}
                    columns={vehicleColumns}
                    loading={loading}
                    sortable={true}
                    pagination={false}
                    emptyMessage="No vehicles found"
                />
            </div>
        </div>
    );
};

export default FleetDashboard;
