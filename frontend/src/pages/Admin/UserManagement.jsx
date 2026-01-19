/**
 * Ministry of Health Uganda - User Management Page
 * Institutional design for managing system users and permissions
 */
import React, { useState, useEffect, useCallback } from 'react';
import { 
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
    Col,
    Divider
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
import '../../theme/moh-institutional-theme.css';

const { Option } = Select;
const { Text, Title } = Typography;

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

    const applyFilters = useCallback(() => {
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
    }, [users, searchText, roleFilter, statusFilter]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

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
        const roleColors = {
            admin: '#E53935',
            it: '#1976D2',
            store: '#FF8F00',
            garage: '#00A968',
            finance: '#9C27B0',
            user: '#718096'
        };
        return roleColors[role] || '#718096';
    };

    const getModuleColor = (module) => {
        const moduleColors = {
            'All': '#E53935',
            'IT': '#1976D2',
            'Stores': '#FF8F00',
            'Fleet': '#00A968',
            'Finance': '#9C27B0'
        };
        return moduleColors[module] || '#718096';
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
                <Tag 
                    color={getRoleColor(role)}
                    style={{ 
                        borderRadius: '4px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        border: 'none'
                    }}
                >
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            render: (module) => (
                <Tag 
                    color={getModuleColor(module)}
                    style={{ 
                        borderRadius: '4px',
                        fontWeight: 500,
                        padding: '2px 8px',
                        border: 'none'
                    }}
                >
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
                <Tag 
                    color={isActive ? '#00A968' : '#E53935'}
                    style={{ 
                        borderRadius: '4px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        border: 'none'
                    }}
                >
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
            subtitle="Manage system users, roles, and access permissions"
        >
            <div style={{ marginBottom: '24px' }}>
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
            </div>

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
                title={
                    <div style={{ 
                        background: 'linear-gradient(135deg, #006747 0%, #004D35 100%)',
                        margin: '-20px -24px 0 -24px',
                        padding: '20px 24px',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '18px'
                    }}>
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </div>
                }
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={720}
                styles={{
                    content: {
                        borderRadius: '8px',
                        overflow: 'hidden'
                    },
                    body: {
                        padding: '24px'
                    }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalSubmit}
                >
                    <Divider orientation="left" style={{ borderColor: '#E2E8F0', marginTop: 0 }}>
                        <Title level={5} style={{ margin: 0, color: '#006747', fontSize: '14px', fontWeight: 600 }}>
                            Personal Information
                        </Title>
                    </Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Username</Text>}
                                rules={[{ required: true, message: 'Please enter username' }]}
                            >
                                <Input 
                                    placeholder="Enter username" 
                                    prefix={<UserOutlined style={{ color: '#5A6872' }} />}
                                    style={{ borderRadius: '4px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Email</Text>}
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input 
                                    placeholder="Enter email" 
                                    prefix={<MailOutlined style={{ color: '#5A6872' }} />}
                                    style={{ borderRadius: '4px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstname"
                                label={<Text strong style={{ color: '#1A1A1A' }}>First Name</Text>}
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="Enter first name" style={{ borderRadius: '4px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastname"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Last Name</Text>}
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Enter last name" style={{ borderRadius: '4px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="health_email"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Health Email</Text>}
                                rules={[{ type: 'email', message: 'Please enter valid email' }]}
                            >
                                <Input 
                                    placeholder="Enter health email" 
                                    prefix={<MailOutlined style={{ color: '#5A6872' }} />}
                                    style={{ borderRadius: '4px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Phone</Text>}
                            >
                                <Input placeholder="Enter phone number" style={{ borderRadius: '4px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={{ borderColor: '#E2E8F0' }}>
                        <Title level={5} style={{ margin: 0, color: '#006747', fontSize: '14px', fontWeight: 600 }}>
                            Role & Access
                        </Title>
                    </Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Role</Text>}
                                rules={[{ required: true, message: 'Please select role' }]}
                            >
                                <Select placeholder="Select role" style={{ borderRadius: '4px' }}>
                                    <Option value="admin">Admin</Option>
                                    <Option value="it">IT Manager</Option>
                                    <Option value="store">Store Manager</Option>
                                    <Option value="garage">Fleet Manager</Option>
                                    <Option value="finance">Finance Manager</Option>
                                    <Option value="user">User</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="module"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Module Access</Text>}
                            >
                                <Select placeholder="Select module" style={{ borderRadius: '4px' }}>
                                    <Option value="All">All Modules</Option>
                                    <Option value="IT">IT Assets</Option>
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
                                label={<Text strong style={{ color: '#1A1A1A' }}>Designation</Text>}
                            >
                                <Input placeholder="Enter designation" style={{ borderRadius: '4px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="depart"
                                label={<Text strong style={{ color: '#1A1A1A' }}>Department</Text>}
                            >
                                <Input 
                                    placeholder="Enter department" 
                                    prefix={<TeamOutlined style={{ color: '#5A6872' }} />}
                                    style={{ borderRadius: '4px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="is_active"
                        label={<Text strong style={{ color: '#1A1A1A' }}>Account Status</Text>}
                        valuePropName="checked"
                    >
                        <Switch 
                            checkedChildren="Active" 
                            unCheckedChildren="Inactive"
                        />
                    </Form.Item>

                    <Divider style={{ margin: '16px 0' }} />
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button 
                                onClick={() => {
                                    setModalVisible(false);
                                    form.resetFields();
                                }}
                                style={{ borderRadius: '4px' }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                style={{
                                    background: '#006747',
                                    borderColor: '#006747',
                                    borderRadius: '4px',
                                    fontWeight: 600
                                }}
                            >
                                {editingUser ? 'Update User' : 'Create User'}
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
