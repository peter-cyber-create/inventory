import React, { useState } from 'react';
import {
    Drawer,
    List,
    Button,
    Badge,
    Tag,
    Space,
    Empty,
    Typography,
    Divider,
    Avatar,
    Tooltip
} from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    ClearOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    ExportOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const NotificationPanel = ({
    visible,
    onClose,
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onDeleteNotification,
    onClearAll,
    onExport
}) => {
    const [filterType, setFilterType] = useState('all');

    const getIcon = (type) => {
        const iconMap = {
            success: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />,
            error: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />,
            warning: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />,
            info: <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
        };
        return iconMap[type] || iconMap.info;
    };

    const getModuleColor = (module) => {
        const colorMap = {
            'System': 'blue',
            'Fleet': 'green',
            'Stores': 'orange',
            'Assets': 'purple',
            'Finance': 'red'
        };
        return colorMap[module] || 'default';
    };

    const getPriorityColor = (priority) => {
        const colorMap = {
            'low': 'default',
            'medium': 'blue',
            'high': 'red'
        };
        return colorMap[priority] || 'default';
    };

    const filteredNotifications = filterType === 'all'
        ? notifications
        : notifications.filter(n => n.type === filterType);

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <BellOutlined />
                        <Title level={4} style={{ margin: 0 }}>Notifications</Title>
                        {unreadCount > 0 && (
                            <Badge count={unreadCount} size="small" />
                        )}
                    </Space>
                </div>
            }
            placement="right"
            onClose={onClose}
            visible={visible}
            width={420}
            extra={
                <Space>
                    <Tooltip title="Mark all as read">
                        <Button
                            type="text"
                            icon={<CheckOutlined />}
                            onClick={onMarkAllAsRead}
                            disabled={unreadCount === 0}
                        />
                    </Tooltip>
                    <Tooltip title="Export notifications">
                        <Button
                            type="text"
                            icon={<ExportOutlined />}
                            onClick={onExport}
                        />
                    </Tooltip>
                    <Tooltip title="Clear all">
                        <Button
                            type="text"
                            danger
                            icon={<ClearOutlined />}
                            onClick={onClearAll}
                            disabled={notifications.length === 0}
                        />
                    </Tooltip>
                </Space>
            }
        >
            <div>
                {/* Filter Tabs */}
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Button.Group>
                        <Button
                            size="small"
                            type={filterType === 'all' ? 'primary' : 'default'}
                            onClick={() => setFilterType('all')}
                        >
                            All
                        </Button>
                        <Button
                            size="small"
                            type={filterType === 'success' ? 'primary' : 'default'}
                            onClick={() => setFilterType('success')}
                        >
                            Success
                        </Button>
                        <Button
                            size="small"
                            type={filterType === 'error' ? 'primary' : 'default'}
                            onClick={() => setFilterType('error')}
                        >
                            Errors
                        </Button>
                        <Button
                            size="small"
                            type={filterType === 'warning' ? 'primary' : 'default'}
                            onClick={() => setFilterType('warning')}
                        >
                            Warnings
                        </Button>
                        <Button
                            size="small"
                            type={filterType === 'info' ? 'primary' : 'default'}
                            onClick={() => setFilterType('info')}
                        >
                            Info
                        </Button>
                    </Button.Group>
                </Space>

                <Divider style={{ margin: '12px 0' }} />

                {/* Notifications List */}
                <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    {filteredNotifications.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No notifications"
                        />
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={filteredNotifications}
                            renderItem={notification => (
                                <List.Item
                                    style={{
                                        padding: '12px 0',
                                        backgroundColor: notification.read ? '#fafafa' : '#ffffff',
                                        borderLeft: !notification.read ? '3px solid #1890ff' : '3px solid transparent',
                                        paddingLeft: '12px'
                                    }}
                                    actions={[
                                        !notification.read && (
                                            <Tooltip title="Mark as read">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CheckOutlined />}
                                                    onClick={() => onMarkAsRead(notification.id)}
                                                />
                                            </Tooltip>
                                        ),
                                        <Tooltip title="Delete">
                                            <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => onDeleteNotification(notification.id)}
                                            />
                                        </Tooltip>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={getIcon(notification.type)} shape="circle" />}
                                        title={
                                            <Space wrap>
                                                <Text strong>{notification.title}</Text>
                                                <Tag color={getModuleColor(notification.module)} size="small">
                                                    {notification.module}
                                                </Tag>
                                                <Tag color={getPriorityColor(notification.priority)} size="small">
                                                    {notification.priority}
                                                </Tag>
                                                {notification.actionRequired && (
                                                    <Tag color="red" size="small">Action Required</Tag>
                                                )}
                                            </Space>
                                        }
                                        description={
                                            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                <div style={{ marginBottom: 4, whiteSpace: 'normal', lineHeight: '1.5' }}>
                                                    {notification.message}
                                                </div>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {moment(notification.timestamp).fromNow()}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </div>
        </Drawer>
    );
};

export default NotificationPanel;
