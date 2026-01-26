/**
 * Ministry of Health Uganda - Institutional Header Component
 * Professional, minimal, government-grade navigation header
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';
import NotificationPanel from '../Notification/NotificationPanel';
import '../../theme/moh-institutional-theme.css';

const AppHeader = () => {
    const history = useHistory();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        const unsubscribe = notificationService.subscribe((updatedNotifications) => {
            setNotifications(updatedNotifications);
            setUnreadCount(notificationService.getUnreadCount());
        });

        setNotifications(notificationService.getAll());
        setUnreadCount(notificationService.getUnreadCount());

        return unsubscribe;
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        sessionStorage.clear();
        notificationService.clearSession();
        toast.success('Logged out successfully');
        setTimeout(() => {
            history.push('/');
            window.location.reload();
        }, 300);
    };

    const handleUserMenuClick = (action) => {
        setShowUserMenu(false);
        switch (action) {
            case 'profile':
                toast.info('Profile page coming soon');
                break;
            case 'settings':
                history.push('/settings');
                break;
            case 'logout':
                handleLogout();
                break;
            default:
                break;
        }
    };

    const getUserDisplayName = () => {
        if (user?.firstname && user?.lastname) {
            return `${user.firstname} ${user.lastname}`;
        }
        return user?.username || 'User';
    };

    const getUserRole = () => {
        const role = user?.role || localStorage.getItem('userRole') || '';
        const roleMap = {
            'admin': 'Administrator',
            'it': 'IT Manager',
            'garage': 'Fleet Manager',
            'store': 'Store Manager',
            'finance': 'Finance Manager'
        };
        return roleMap[role] || role.toUpperCase();
    };

    return (
        <>
            <header className="app-header" style={{
                height: 'var(--header-height)',
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--space-5)',
                boxShadow: 'var(--shadow-xs)',
                position: 'sticky',
                top: 0,
                zIndex: 'var(--z-sticky)'
            }}>
                {/* Left: Logo & Title */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)'
                }}>
                    <img 
                        src="/uganda-coat-of-arms.svg" 
                        alt="MoH Uganda" 
                        style={{
                            height: '36px',
                            width: 'auto'
                        }}
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                        }}
                    />
                    <div>
                        <div style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.2
                        }}>
                            MoH Uganda IMS
                        </div>
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 1.2
                        }}>
                            v2.0.0
                        </div>
                    </div>
                </div>

                {/* Right: Actions & User Menu */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)'
                }}>
                    {/* Notifications */}
                    <button
                        type="button"
                        onClick={() => setShowNotificationPanel(true)}
                        style={{
                            position: 'relative',
                            background: 'transparent',
                            border: 'none',
                            padding: 'var(--space-2)',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--color-surface-hover)';
                            e.target.style.color = 'var(--moh-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--color-text-secondary)';
                        }}
                        aria-label="Notifications"
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'var(--color-error)',
                                color: 'var(--color-text-on-primary)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 'var(--font-weight-semibold)',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* User Menu */}
                    <div style={{ position: 'relative' }}>
                        <button
                            type="button"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                background: 'transparent',
                                border: '1px solid var(--color-border-primary)',
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = 'var(--moh-primary)';
                                e.target.style.background = 'var(--color-surface-hover)';
                            }}
                            onMouseLeave={(e) => {
                                if (!showUserMenu) {
                                    e.target.style.borderColor = 'var(--color-border-primary)';
                                    e.target.style.background = 'transparent';
                                }
                            }}
                            aria-label="User menu"
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--moh-primary)',
                                color: 'var(--color-text-on-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-semibold)'
                            }}>
                                {user?.firstname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-text-primary)',
                                    lineHeight: 1.2
                                }}>
                                    {getUserDisplayName()}
                                </div>
                                <div style={{
                                    fontSize: 'var(--font-size-xs)',
                                    color: 'var(--color-text-tertiary)',
                                    lineHeight: 1.2
                                }}>
                                    {getUserRole()}
                                </div>
                            </div>
                            <span style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--color-text-tertiary)',
                                transition: 'transform var(--transition-base)',
                                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                                ▼
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 'var(--z-dropdown)'
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + var(--space-2))',
                                    right: 0,
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border-primary)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-md)',
                                    minWidth: '200px',
                                    zIndex: 'var(--z-dropdown)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderBottom: '1px solid var(--color-border-primary)',
                                        background: 'var(--color-bg-secondary)'
                                    }}>
                                        <div style={{
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: 'var(--font-weight-semibold)',
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            {getUserDisplayName()}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--color-text-tertiary)',
                                            marginTop: 'var(--space-1)'
                                        }}>
                                            {user?.email || ''}
                                        </div>
                                    </div>
                                    <div style={{ padding: 'var(--space-2)' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleUserMenuClick('profile')}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3) var(--space-4)',
                                                textAlign: 'left',
                                                background: 'transparent',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-primary)',
                                                transition: 'all var(--transition-base)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--color-surface-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                            }}
                                        >
                                            👤 Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUserMenuClick('settings')}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3) var(--space-4)',
                                                textAlign: 'left',
                                                background: 'transparent',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-text-primary)',
                                                transition: 'all var(--transition-base)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--color-surface-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                            }}
                                        >
                                            ⚙️ Settings
                                        </button>
                                        <div style={{
                                            height: '1px',
                                            background: 'var(--color-border-primary)',
                                            margin: 'var(--space-2) 0'
                                        }} />
                                        <button
                                            type="button"
                                            onClick={() => handleUserMenuClick('logout')}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3) var(--space-4)',
                                                textAlign: 'left',
                                                background: 'transparent',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--color-error)',
                                                fontWeight: 'var(--font-weight-semibold)',
                                                transition: 'all var(--transition-base)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--color-error-bg)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                            }}
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <NotificationPanel
                visible={showNotificationPanel}
                onClose={() => setShowNotificationPanel(false)}
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={(id) => notificationService.markAsRead(id)}
                onMarkAllAsRead={() => notificationService.markAllAsRead()}
                onDeleteNotification={(id) => notificationService.deleteNotification(id)}
                onClearAll={() => notificationService.clearAll()}
                onExport={() => notificationService.export()}
            />
        </>
    );
};

export default AppHeader;
