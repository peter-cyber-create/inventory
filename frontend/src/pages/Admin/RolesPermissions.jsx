import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RolesPermissions = () => {
    const [roles] = useState([
        {
            id: 1,
            name: 'admin',
            displayName: 'Administrator',
            description: 'Full system access',
            permissions: ['create', 'read', 'update', 'delete', 'admin'],
            isActive: true
        },
        {
            id: 2,
            name: 'it',
            displayName: 'IT Manager',
            description: 'IT assets management',
            permissions: ['create', 'read', 'update'],
            isActive: true
        },
        {
            id: 3,
            name: 'store',
            displayName: 'Store Manager',
            description: 'Stores management',
            permissions: ['create', 'read', 'update'],
            isActive: true
        },
        {
            id: 4,
            name: 'garage',
            displayName: 'Fleet Manager',
            description: 'Vehicle management',
            permissions: ['create', 'read', 'update'],
            isActive: true
        },
        {
            id: 5,
            name: 'finance',
            displayName: 'Finance Manager',
            description: 'Financial activities',
            permissions: ['create', 'read', 'update'],
            isActive: true
        }
    ]);

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'displayName',
            key: 'displayName',
            render: (text, record) => (
                <Space>
                    <TeamOutlined />
                    <Text strong>{text}</Text>
                    <Tag color="blue">{record.name}</Tag>
                </Space>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) => (
                <Space wrap>
                    {permissions.map(permission => (
                        <Tag key={permission} color="green">{permission}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} size="small">
                        Edit
                    </Button>
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2}>Roles & Permissions</Title>
                    <Text type="secondary">Manage user roles and their permissions</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add Role
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default RolesPermissions;
