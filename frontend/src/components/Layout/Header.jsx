/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, Badge, Button, message } from 'antd';
import { 
    BellOutlined, 
    UserOutlined, 
    SettingOutlined, 
    LogoutOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import NotificationPanel from '../Notification/NotificationPanel';

const { Header } = Layout;

const AppHeader = () => {
    const history = useHistory();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);

    useEffect(() => {
        // Subscribe to notification service
        const unsubscribe = notificationService.subscribe((updatedNotifications) => {
            setNotifications(updatedNotifications);
            setUnreadCount(notificationService.getUnreadCount());
        });

        // Initialize with current notifications
        setNotifications(notificationService.getAll());
        setUnreadCount(notificationService.getUnreadCount());

        return unsubscribe;
    }, []);

    const handleUserMenuClick = ({ key }) => {
        switch (key) {
            case 'profile':
                message.info('Profile page would open here');
                break;
            case 'settings':
                history.push('/settings');
                break;
            case 'logout':
                // Clear all stored user data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
                
                // Clear session-based data
                sessionStorage.clear();
                
                // Clear notifications for this session
                notificationService.clearSession();
                
                message.success('Logout successful');
                
                // Redirect to login page
                setTimeout(() => {
                    history.push('/');
                    window.location.reload();
                }, 500);
                break;
            default:
                break;
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile'
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings'
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout'
        }
    ];

    const handleNotificationClick = () => {
        setShowNotificationPanel(true);
    };

    return (
        <>
            <Header style={{ 
                background: '#0f172a', 
                padding: '0 24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                        src="/uganda-coat-of-arms.svg" 
                        alt="MoH Uganda" 
                        style={{ height: '40px', marginRight: '16px' }}
                    />
                    <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        MoH Uganda IMS v2.0.0
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Badge count={unreadCount} size="small">
                        <Button 
                            type="text" 
                            icon={<BellOutlined />} 
                            style={{ color: '#ffffff', fontSize: '18px' }}
                            onClick={handleNotificationClick}
                        />
                    </Badge>

                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button 
                            type="text" 
                            style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Avatar 
                                size="small" 
                                icon={<UserOutlined />} 
                                style={{ backgroundColor: '#FFD700' }}
                            />
                            <span style={{ color: '#ffffff' }}>Admin User</span>
                        </Button>
                    </Dropdown>
                </div>
            </Header>

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