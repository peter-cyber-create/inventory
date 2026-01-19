/**
 * Ministry of Health Uganda - Institutional Sidebar Component
 * Professional, role-aware navigation with clear module separation
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../../theme/moh-institutional-theme.css';

const AppSidebar = ({ collapsed, user }) => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const history = useHistory();
    const location = useLocation();

    // Module definitions with icons (using emoji for simplicity, can be replaced with icon library)
    const modules = [
        {
            key: 'dashboard',
            title: 'Dashboard',
            icon: '📊',
            roles: ['admin']
        },
        {
            key: 'it',
            title: 'ICT Assets',
            icon: '💻',
            roles: ['admin', 'it']
        },
        {
            key: 'fleet',
            title: 'Fleet Management',
            icon: '🚗',
            roles: ['admin', 'garage']
        },
        {
            key: 'stores',
            title: 'Stores Management',
            icon: '📦',
            roles: ['admin', 'store']
        },
        {
            key: 'finance',
            title: 'Finance Activities',
            icon: '💰',
            roles: ['admin', 'finance']
        },
        {
            key: 'admin',
            title: 'Administration',
            icon: '⚙️',
            roles: ['admin']
        }
    ];

    // Get menu items for a module
    const getModuleMenuItems = useCallback((moduleKey) => {
        switch (moduleKey) {
            case 'dashboard':
                return [
                    { key: '/dashboard', label: 'Overview' }
                ];

            case 'it':
                return [
                    { key: '/ict/dashboard', label: 'Dashboard' },
                    { key: '/ict/assets', label: 'Assets Inventory' },
                    { key: '/ict/maintanance', label: 'Maintenance' },
                    { key: '/ict/requisition', label: 'Requisitions' },
                    { key: '/ict/issue', label: 'Issue Management' },
                    { key: '/ict/servers', label: 'Servers' },
                    {
                        key: 'ict-admin',
                        label: 'Administration',
                        children: [
                            { key: '/ict/categories', label: 'Categories' },
                            { key: '/ict/brands', label: 'Brands' },
                            { key: '/ict/models', label: 'Models' },
                            { key: '/ict/types', label: 'Types' },
                            { key: '/ict/departments', label: 'Departments' },
                            { key: '/ict/divisions', label: 'Divisions' },
                            { key: '/ict/facilities', label: 'Facilities' },
                            { key: '/ict/staff', label: 'Staff' },
                            { key: '/ict/users', label: 'Users' }
                        ]
                    },
                    {
                        key: 'ict-reports',
                        label: 'Reports',
                        children: [
                            { key: '/ict/reports/inventory', label: 'Inventory Report' },
                            { key: '/ict/reports/users', label: 'Users Report' },
                            { key: '/ict/reports/transfers', label: 'Transfers Report' },
                            { key: '/ict/reports/maintenance', label: 'Maintenance Report' },
                            { key: '/ict/reports/disposal', label: 'Disposal Report' }
                        ]
                    }
                ];

            case 'fleet':
                return [
                    { key: '/fleet/dashboard', label: 'Dashboard' },
                    { key: '/fleet/vehicles', label: 'Vehicles' },
                    { key: '/fleet/spareparts', label: 'Spare Parts' },
                    { key: '/fleet/requistion', label: 'Requisitions' },
                    { key: '/fleet/receiving', label: 'Receiving' },
                    { key: '/fleet/jobcards', label: 'Job Cards' },
                    {
                        key: 'fleet-masters',
                        label: 'Master Data',
                        children: [
                            { key: '/fleet/vehicles/types', label: 'Vehicle Types' },
                            { key: '/fleet/vehicles/make', label: 'Vehicle Makes' },
                            { key: '/fleet/masters/drivers', label: 'Drivers' },
                            { key: '/fleet/masters/garages', label: 'Garages' },
                            { key: '/fleet/masters/categories', label: 'Spare Categories' },
                            { key: '/fleet/masters/departments', label: 'Departments' }
                        ]
                    },
                    {
                        key: 'fleet-reports',
                        label: 'Reports',
                        children: [
                            { key: '/fleet/reports/servicehistory', label: 'Service History' }
                        ]
                    }
                ];

            case 'stores':
                return [
                    { key: '/stores/dashboard', label: 'Dashboard' },
                    { key: '/stores/grn', label: 'GRN (Goods Received Notes)' },
                    { key: '/stores/ledger', label: 'Stock Ledger' },
                    { key: '/stores/form76a', label: 'Requisitions/Issuance (Form 76A)' },
                    { key: '/stores/reports', label: 'Reports' }
                ];

            case 'finance':
                return [
                    { key: '/finance/dashboard', label: 'Dashboard' },
                    { key: '/activities/add', label: 'Add Activity' },
                    { key: '/activities/listing', label: 'Activities List' },
                    { key: '/activities/users', label: 'Users' },
                    {
                        key: 'activity-reports',
                        label: 'Reports',
                        children: [
                            { key: '/report/activities', label: 'Activities by Date' },
                            { key: '/report/funding', label: 'Activities by Funding' },
                            { key: '/report/person', label: 'Activities by Person' },
                            { key: '/report/accountability', label: 'Pending Accountability' },
                            { key: '/report/participant/activity', label: 'Activities by Participant' },
                            { key: '/report/flagged', label: 'Flagged Users' },
                            { key: '/report/user/amounts', label: 'User Amounts' }
                        ]
                    }
                ];

            case 'admin':
                return [
                    { key: '/admin/dashboard', label: 'Admin Dashboard' },
                    { key: '/admin/users', label: 'User Management' },
                    { key: '/admin/roles', label: 'Roles & Permissions' },
                    { key: '/admin/settings', label: 'System Settings' },
                    {
                        key: 'admin-reports',
                        label: 'System Reports',
                        children: [
                            { key: '/admin/reports/overview', label: 'System Overview' },
                            { key: '/admin/reports/modules', label: 'Module Reports' }
                        ]
                    }
                ];

            default:
                return [];
        }
    }, []);

    // Filter modules based on user role
    const visibleModules = modules.filter(module => {
        const userRole = user?.role || localStorage.getItem('userRole');
        if (!userRole) return false;
        if (userRole === 'admin') return true;
        if (userRole === 'it' && module.key === 'it') return true;
        if (userRole === 'garage' && module.key === 'fleet') return true;
        if (userRole === 'store' && module.key === 'stores') return true;
        if (userRole === 'finance' && module.key === 'finance') return true;
        return false;
    });

    useEffect(() => {
        const path = location.pathname;
        setSelectedKeys([path]);
        
        if (path.includes('/ict/')) {
            setOpenKeys(['ict-admin', 'ict-reports']);
        } else if (path.includes('/fleet/')) {
            setOpenKeys(['fleet-masters', 'fleet-reports']);
        } else if (path.includes('/stores/')) {
            setOpenKeys(['stores-admin', 'stores-reports']);
        } else if (path.includes('/activities/') || path.includes('/report/')) {
            setOpenKeys(['activity-reports']);
        } else if (path.includes('/admin/')) {
            setOpenKeys(['admin-reports']);
        }
    }, [location]);

    const handleMenuClick = (key) => {
        if (key === 'dashboard') {
            const userRole = user?.role || localStorage.getItem('userRole');
            if (userRole === 'admin') {
                history.push('/dashboard');
            } else if (userRole === 'it') {
                history.push('/ict/dashboard');
            } else if (userRole === 'garage') {
                history.push('/fleet/dashboard');
            } else if (userRole === 'store') {
                history.push('/stores/dashboard');
            } else if (userRole === 'finance') {
                history.push('/finance/dashboard');
            } else {
                history.push('/ict/dashboard');
            }
        } else {
            history.push(key);
        }
    };

    const renderMenuItem = (item, level = 0) => {
        const isSelected = selectedKeys.includes(item.key);
        const isOpen = openKeys.includes(item.key);
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.key} style={{ marginBottom: level === 0 ? 'var(--space-2)' : 0 }}>
                    <button
                        type="button"
                        onClick={() => {
                            if (isOpen) {
                                setOpenKeys(openKeys.filter(k => k !== item.key));
                            } else {
                                setOpenKeys([...openKeys, item.key]);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: 'var(--space-3) var(--space-4)',
                            textAlign: 'left',
                            background: isSelected ? 'var(--color-success-bg)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                            color: isSelected ? 'var(--moh-primary)' : 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all var(--transition-base)',
                            paddingLeft: level > 0 ? `calc(var(--space-4) * ${level + 1})` : 'var(--space-4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSelected) {
                                e.target.style.background = 'var(--color-surface-hover)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected) {
                                e.target.style.background = 'transparent';
                            }
                        }}
                    >
                        <span>{item.label}</span>
                        <span style={{
                            fontSize: 'var(--font-size-xs)',
                            transition: 'transform var(--transition-base)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>
                            ▼
                        </span>
                    </button>
                    {isOpen && (
                        <div style={{ marginLeft: 'var(--space-4)' }}>
                            {item.children.map(child => renderMenuItem(child, level + 1))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                key={item.key}
                type="button"
                onClick={() => handleMenuClick(item.key)}
                style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    textAlign: 'left',
                    background: isSelected ? 'var(--color-success-bg)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                    color: isSelected ? 'var(--moh-primary)' : 'var(--color-text-primary)',
                    transition: 'all var(--transition-base)',
                    paddingLeft: level > 0 ? `calc(var(--space-4) * ${level + 1})` : 'var(--space-4)',
                    borderLeft: isSelected ? '3px solid var(--moh-primary)' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) {
                        e.target.style.background = 'var(--color-surface-hover)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) {
                        e.target.style.background = 'transparent';
                    }
                }}
            >
                {item.label}
            </button>
        );
    };

    return (
        <aside className="app-sidebar" style={{
            width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
            background: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border-primary)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 'var(--header-height)',
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'width var(--transition-base)',
            zIndex: 'var(--z-fixed)'
        }}>
            {!collapsed && (
                <>
                    {/* Module Navigation */}
                    <nav style={{
                        padding: 'var(--space-4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-6)'
                    }}>
                        {visibleModules.map((module) => {
                            const moduleMenuItems = getModuleMenuItems(module.key);
                            const isActive = location.pathname.includes(`/${module.key === 'it' ? 'ict' : module.key}/`);

                            return (
                                <div key={module.key}>
                                    {/* Module Header */}
                                    <div style={{
                                        padding: 'var(--space-2) var(--space-3)',
                                        background: isActive ? 'var(--color-success-bg)' : 'var(--color-bg-secondary)',
                                        borderLeft: `3px solid ${isActive ? 'var(--moh-primary)' : 'var(--color-border-primary)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        <div style={{
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: 'var(--font-weight-bold)',
                                            color: isActive ? 'var(--moh-primary)' : 'var(--color-text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)'
                                        }}>
                                            <span>{module.icon}</span>
                                            <span>{module.title}</span>
                                        </div>
                                    </div>

                                    {/* Module Menu Items */}
                                    {moduleMenuItems.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--space-1)'
                                        }}>
                                            {moduleMenuItems.map(item => renderMenuItem(item))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 'var(--space-4)',
                        borderTop: '1px solid var(--color-border-primary)',
                        background: 'var(--color-bg-secondary)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>
                            MoH Uganda IMS
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            marginTop: 'var(--space-1)'
                        }}>
                            v2.0.0
                        </div>
                    </div>
                </>
            )}

            {collapsed && (
                <div style={{
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-4)'
                }}>
                    {visibleModules.map(module => (
                        <button
                            key={module.key}
                            type="button"
                            onClick={() => {
                                const userRole = user?.role || localStorage.getItem('userRole');
                                const path = module.key === 'it' ? '/ict/dashboard' : `/${module.key}/dashboard`;
                                history.push(path);
                            }}
                            style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                                border: '1px solid var(--color-border-primary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-size-lg)',
                                transition: 'all var(--transition-base)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--color-surface-hover)';
                                e.target.style.borderColor = 'var(--moh-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.borderColor = 'var(--color-border-primary)';
                            }}
                            title={module.title}
                        >
                            {module.icon}
                        </button>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default AppSidebar;
