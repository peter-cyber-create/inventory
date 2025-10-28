import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Space, 
    Tag, 
    Typography, 
    Modal, 
    Form, 
    Input, 
    Select, 
    Switch,
    message,
    Popconfirm,
    Tooltip,
    Row,
    Col
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    UserOutlined,
    MailOutlined,
    TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    // Sample data - replace with API call
    const [usersData] = useState([
        {
            id: 1,
            username: 'admin',
            email: 'admin@moh.go.ug',
            health_email: 'admin@health.go.ug',
            firstname: 'Admin',
            lastname: 'User',
            role: 'admin',
            phone: '+256 701 234 567',
            designation: 'System Administrator',
            module: 'All',
            depart: 'IT Department',
            is_active: true,
            createdat: '2025-10-27T04:12:20.764Z'
        },
        {
            id: 2,
            username: 'store_manager',
            email: 'store@moh.go.ug',
            health_email: 'store@health.go.ug',
            firstname: 'Store',
            lastname: 'Manager',
            role: 'store',
            phone: '+256 701 234 568',
            designation: 'Store Manager',
            module: 'Stores',
            depart: 'Stores Department',
            is_active: true,
            createdat: '2025-10-27T04:12:20.768Z'
        },
        {
            id: 3,
            username: 'it_manager',
            email: 'it@moh.go.ug',
            health_email: 'it@health.go.ug',
            firstname: 'IT',
            lastname: 'Manager',
            role: 'it',
            phone: '+256 701 234 569',
            designation: 'IT Manager',
            module: 'IT',
            depart: 'IT Department',
            is_active: true,
            createdat: '2025-10-27T04:12:20.770Z'
        },
        {
            id: 4,
            username: 'fleet_manager',
            email: 'fleet@moh.go.ug',
            health_email: 'fleet@health.go.ug',
            firstname: 'Fleet',
            lastname: 'Manager',
            role: 'garage',
            phone: '+256 701 234 570',
            designation: 'Fleet Manager',
            module: 'Fleet',
            depart: 'Fleet Department',
            is_active: true,
            createdat: '2025-10-27T04:12:20.771Z'
        },
        {
            id: 5,
            username: 'finance_manager',
            email: 'finance@moh.go.ug',
            health_email: 'finance@health.go.ug',
            firstname: 'Finance',
            lastname: 'Manager',
            role: 'finance',
            phone: '+256 701 234 571',
            designation: 'Finance Manager',
            module: 'Finance',
            depart: 'Finance Department',
            is_active: true,
            createdat: '2025-10-27T04:12:20.773Z'
        }
    ]);

    useEffect(() => {
        fetchUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const data = await response.json();
            if (data.status === 'success') {
                setUsers(data.users);
            } else {
                // Fallback to sample data
                setUsers(usersData);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to sample data
            setUsers(usersData);
        }
        setLoading(false);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            health_email: user.health_email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            phone: user.phone,
            designation: user.designation,
            module: user.module,
            depart: user.depart,
            is_active: user.is_active
        });
        setModalVisible(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            // API call to delete user
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                message.success('User deleted successfully');
                fetchUsers();
            } else {
                message.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            const url = editingUser 
                ? `http://localhost:5000/api/users/${editingUser.id}`
                : 'http://localhost:5000/api/users';
            
            const method = editingUser ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                message.success(editingUser ? 'User updated successfully' : 'User created successfully');
                setModalVisible(false);
                fetchUsers();
            } else {
                message.error('Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            message.error('Error saving user');
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'red',
            it: 'blue',
            store: 'orange',
            garage: 'green',
            finance: 'purple',
            user: 'default'
        };
        return colors[role] || 'default';
    };

    const getModuleColor = (module) => {
        const colors = {
            'All': 'red',
            'IT': 'blue',
            'Stores': 'orange',
            'Fleet': 'green',
            'Finance': 'purple'
        };
        return colors[module] || 'default';
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Full Name',
            key: 'fullname',
            render: (text, record) => `${record.firstname} ${record.lastname}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <Space>
                    <MailOutlined />
                    <Text>{email}</Text>
                </Space>
            ),
        },
        {
            title: 'Health Email',
            dataIndex: 'health_email',
            key: 'health_email',
            render: (email) => email ? (
                <Space>
                    <MailOutlined />
                    <Text type="secondary">{email}</Text>
                </Space>
            ) : <Text type="secondary">Not set</Text>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={getRoleColor(role)}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            render: (module) => (
                <Tag color={getModuleColor(module)}>
                    {module}
                </Tag>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'depart',
            key: 'depart',
            render: (dept) => (
                <Space>
                    <TeamOutlined />
                    <Text>{dept}</Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
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
                    <Tooltip title="Edit User">
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEditUser(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete User">
                            <Button 
                                type="primary" 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2}>User Management</Title>
                    <Text type="secondary">Manage system users and their permissions</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </div>

            {/* Users Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
                    }}
                />
            </Card>

            {/* Add/Edit User Modal */}
            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: 'Please enter username' }]}
                            >
                                <Input placeholder="Enter username" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstname"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="Enter first name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastname"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Enter last name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="health_email"
                                label="Health Email"
                                rules={[{ type: 'email', message: 'Please enter valid email' }]}
                            >
                                <Input placeholder="Enter health email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: 'Please select role' }]}
                            >
                                <Select placeholder="Select role">
                                    <Option value="admin">Admin</Option>
                                    <Option value="it">IT</Option>
                                    <Option value="store">Store</Option>
                                    <Option value="garage">Garage</Option>
                                    <Option value="finance">Finance</Option>
                                    <Option value="user">User</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="module"
                                label="Module"
                            >
                                <Select placeholder="Select module">
                                    <Option value="All">All</Option>
                                    <Option value="IT">IT</Option>
                                    <Option value="Stores">Stores</Option>
                                    <Option value="Fleet">Fleet</Option>
                                    <Option value="Finance">Finance</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="designation"
                                label="Designation"
                            >
                                <Input placeholder="Enter designation" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="depart"
                                label="Department"
                            >
                                <Input placeholder="Enter department" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="is_active"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingUser ? 'Update User' : 'Create User'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
