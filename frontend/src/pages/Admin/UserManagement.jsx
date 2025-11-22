import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Button, 
    Space, 
    Tag, 
    Modal, 
    Form, 
    Input, 
    Select, 
    Switch,
    message,
    Popconfirm,
    Tooltip,
    Typography,
    Row,
    Col
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    UserOutlined,
    MailOutlined,
    TeamOutlined,
    KeyOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/Layout/PageLayout';
import SearchFilters from '../../components/Common/SearchFilters';
import PasswordChangeModal from '../../components/Common/PasswordChangeModal';
import API from '../../helpers/api';
import StandardTable from '../../components/Common/StandardTable';
import StandardForm from '../../components/Common/StandardForm';

const { Option } = Select;
const { Text } = Typography;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [form] = Form.useForm();
    
    // Search and filter states
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        applyFilters();
    }, [users, searchText, roleFilter, statusFilter]);

    const applyFilters = () => {
        let filtered = [...users];

        // Search filter
        if (searchText) {
            filtered = filtered.filter(user => 
                user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Role filter
        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Status filter
        if (statusFilter !== '') {
            filtered = filtered.filter(user => user.is_active === (statusFilter === 'active'));
        }

        setFilteredUsers(filtered);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await API.get('/api/users');
            const data = response.data;
            if (data.status === 'success') {
                setUsers(data.users);
            } else {
                console.error('Failed to fetch users:', data.message);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
        setLoading(false);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleChangePassword = (userId) => {
        setSelectedUserId(userId);
        setPasswordModalVisible(true);
    };

    const handlePasswordChangeSuccess = () => {
        setPasswordModalVisible(false);
        setSelectedUserId(null);
        fetchUsers();
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleFilterChange = (key, value) => {
        if (key === 'role') setRoleFilter(value);
        if (key === 'status') setStatusFilter(value);
    };

    const handleResetFilters = () => {
        setSearchText('');
        setRoleFilter('');
        setStatusFilter('');
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
            await API.delete(`/api/users/${userId}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            let response;
            if (editingUser) {
                response = await API.patch(`/api/users/${editingUser.id}`, values);
            } else {
                response = await API.post('/api/users', values);
            }
            
            const data = response.data;
            
            if (data.status === 'success') {
                message.success(editingUser ? 'User updated successfully' : 'User created successfully');
                setModalVisible(false);
                fetchUsers();
            } else {
                message.error(data.message || 'Failed to save user');
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
                    <Tooltip title="Change Password">
                        <Button 
                            type="default" 
                            icon={<KeyOutlined />} 
                            size="small"
                            onClick={() => handleChangePassword(record.id)}
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

    const searchFilters = [
        {
            key: 'role',
            placeholder: 'Filter by Role',
            value: roleFilter,
            options: [
                { value: 'admin', label: 'Admin' },
                { value: 'it', label: 'IT Manager' },
                { value: 'store', label: 'Store Manager' },
                { value: 'garage', label: 'Fleet Manager' },
                { value: 'finance', label: 'Finance Manager' },
                { value: 'user', label: 'User' }
            ]
        },
        {
            key: 'status',
            placeholder: 'Filter by Status',
            value: statusFilter,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        }
    ];

    return (
        <PageLayout
            title="User Management"
            subtitle="Manage system users and their permissions"
            extra={
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            }
            loading={loading}
        >
            <SearchFilters
                searchPlaceholder="Search users by name, email, or username..."
                searchValue={searchText}
                onSearchChange={setSearchText}
                onSearch={handleSearch}
                filters={searchFilters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                loading={loading}
            />

            <StandardTable
                title="Users"
                dataSource={filteredUsers}
                columns={columns.slice(0, -1)} // Remove actions column as it's handled by StandardTable
                loading={loading}
                onCreateClick={handleAddUser}
                onEditClick={handleEditUser}
                onDeleteClick={(user) => handleDeleteUser(user.id)}
                createButtonText="Add User"
                rowKey="id"
            />

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

            {/* Password Change Modal */}
            <PasswordChangeModal
                visible={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                userId={selectedUserId}
                onSuccess={handlePasswordChangeSuccess}
            />
        </PageLayout>
    );
};

export default UserManagement;
