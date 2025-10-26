/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, Badge, Button, Typography, Space, List, Tag, message } from 'antd';
import { 
    BellOutlined, 
    UserOutlined, 
    SettingOutlined, 
    LogoutOutlined,
    CheckOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    DownloadOutlined,
    ClearOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import notificationService from '../../services/notificationService';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const history = useHistory();
    const [notifications, setNotifications] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // Subscribe to notification service
        const unsubscribe = notificationService.subscribe((updatedNotifications) => {
            setNotifications(updatedNotifications);
            setUnreadCount(notificationService.getUnreadCount());
        });

        // Initialize with current notifications
        setNotifications(notificationService.getNotifications());
        setUnreadCount(notificationService.getUnreadCount());

        return unsubscribe;
    }, []);

    const markAsRead = (notificationId) => {
        notificationService.markAsRead(notificationId);
    };

    const markAllAsRead = () => {
        notificationService.markAllAsRead();
        message.success('All notifications marked as read');
    };

    const deleteNotification = (notificationId) => {
        notificationService.deleteNotification(notificationId);
        message.success('Notification deleted');
    };

    const clearAllNotifications = () => {
        notificationService.clearAllNotifications();
        message.success('All notifications cleared');
    };

    const exportNotifications = () => {
        notificationService.exportNotifications();
        message.success('Notifications exported successfully');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckOutlined style={{ color: '#52c41a' }} />;
            case 'warning':
                return <WarningOutlined style={{ color: '#faad14' }} />;
            case 'error':
                return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'info':
                return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
            default:
                return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            case 'info':
                return 'processing';
            default:
                return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'blue';
        }
    };

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
                notificationService.clearSessionNotifications();
                
                message.success('Logout successful');
                
                // Add final logout notification (will be cleared immediately but shows feedback)
                notificationService.addSystemNotification(
                    'Logout Successful',
                    'You have been successfully logged out of the system',
                    'info',
                    'low'
                );
                
                // Small delay to show the message, then redirect
                setTimeout(() => {
                    // Redirect to login page
                    history.push('/');
                    // Force page refresh to clear any remaining state
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

    const notificationOverlay = (
        <div style={{ width: 450, maxHeight: 600, overflowY: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Notifications</Text>
                    <Space>
                        <Button size="small" onClick={markAllAsRead}>
                            Mark All Read
                        </Button>
                        <Badge count={unreadCount} size="small" />
                    </Space>
                </div>
                <div style={{ marginTop: '12px' }}>
                    <Space>
                        <Button size="small" icon={<DownloadOutlined />} onClick={exportNotifications}>
                            Export
                        </Button>
                        <Button size="small" icon={<ClearOutlined />} onClick={clearAllNotifications} danger>
                            Clear All
                        </Button>
                    </Space>
                </div>
            </div>
            <List
                dataSource={notifications}
                renderItem={(notification) => (
                    <List.Item
                        style={{
                            padding: '12px 16px',
                            backgroundColor: notification.read ? '#fafafa' : '#fff',
                            borderBottom: '1px solid #f0f0f0'
                        }}
                        actions={[
                            !notification.read && (
                                <Button 
                                    size="small" 
                                    type="text" 
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    Mark Read
                                </Button>
                            ),
                            <Button 
                                size="small" 
                                type="text" 
                                danger 
                                onClick={() => deleteNotification(notification.id)}
                            >
                                Delete
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={getNotificationIcon(notification.type)}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong>{notification.title}</Text>
                                    <Space>
                                        <Tag color={getNotificationColor(notification.type)} size="small">
                                            {notification.module}
                                        </Tag>
                                        <Tag color={getPriorityColor(notification.priority)} size="small">
                                            {notification.priority}
                                        </Tag>
                                    </Space>
                                </div>
                            }
                            description={
                                <div>
                                    <div>{notification.message}</div>
                                    <div style={{ marginTop: '4px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {new Date(notification.timestamp).toLocaleString()}
                                        </Text>
                                        {notification.actionRequired && (
                                            <Tag color="red" style={{ marginLeft: '8px' }}>Action Required</Tag>
                                        )}
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
            {notifications.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                    <Text type="secondary">No notifications</Text>
                </div>
            )}
        </div>
    );

    return (
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
                <Text style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>
                    Ministry of Health Uganda
                </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Dropdown
                    overlay={notificationOverlay}
                    trigger={['click']}
                    placement="bottomRight"
                    onVisibleChange={setShowNotifications}
                >
                    <Badge count={unreadCount} size="small">
                        <Button 
                            type="text" 
                            icon={<BellOutlined />} 
                            style={{ color: '#ffffff', fontSize: '18px' }}
                        />
                    </Badge>
                </Dropdown>

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
                        <Text style={{ color: '#ffffff' }}>Admin User</Text>
                    </Button>
                </Dropdown>
            </div>
        </Header>
    );
};

export default AppHeader;
