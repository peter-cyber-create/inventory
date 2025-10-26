import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Form, 
    Input, 
    Button, 
    Switch, 
    Select, 
    Typography, 
    Avatar, 
    Upload, 
    message, 
    Tabs,
    Space,
    Tag
} from 'antd';
import { 
    UserOutlined, 
    LockOutlined, 
    BellOutlined, 
    SettingOutlined, 
    UploadOutlined,
    SaveOutlined,
    KeyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();


    const [userProfile, setUserProfile] = useState({
        name: 'Admin User',
        email: 'admin@moh.ug',
        phone: '+256 701 234 567',
        role: 'System Administrator',
        department: 'IT Department',
        avatar: null
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        maintenanceAlerts: true,
        lowStockAlerts: true,
        budgetAlerts: true,
        securityAlerts: true,
        dailyDigest: false,
        weeklyReport: true
    });

    const [systemSettings, setSystemSettings] = useState({
        language: 'English',
        timezone: 'Africa/Kampala',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24-hour',
        theme: 'Light',
        autoLogout: 30,
        sessionTimeout: 15,
        backupFrequency: 'Daily',
        dataRetention: '7 years'
    });

    const handleProfileUpdate = (values) => {
        setLoading(true);
        setTimeout(() => {
            setUserProfile({ ...userProfile, ...values });
            message.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    const handlePasswordChange = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('New passwords do not match!');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            message.success('Password changed successfully!');
            passwordForm.resetFields();
            setLoading(false);
        }, 1000);
    };

    const handleNotificationSettingsChange = (key, value) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
        message.success('Notification settings updated!');
    };

    const handleSystemSettingsChange = (key, value) => {
        setSystemSettings(prev => ({ ...prev, [key]: value }));
        message.success('System settings updated!');
    };

    const handleSaveAllSettings = () => {
        setLoading(true);
        setTimeout(() => {
            message.success('All settings saved successfully!');
            setLoading(false);
        }, 1000);
    };

    const uploadProps = {
        name: 'avatar',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                setUserProfile(prev => ({ ...prev, avatar: info.file.response.url }));
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0, color: '#0f172a' }}>
                    <SettingOutlined style={{ marginRight: '12px' }} />
                    System Settings
                </Title>
                <Text type="secondary">Manage your profile, preferences, and system configuration</Text>
            </div>

            <Tabs defaultActiveKey="profile" size="large">
                <TabPane 
                    tab={
                        <span>
                            <UserOutlined />
                            Profile Settings
                        </span>
                    } 
                    key="profile"
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card title="Personal Information" style={{ borderRadius: '12px' }}>
                                <Form 
                                    form={profileForm} 
                                    layout="vertical" 
                                    initialValues={userProfile}
                                    onFinish={handleProfileUpdate}
                                >
                                    <Row gutter={16}>
                                        <Col span={24} style={{ textAlign: 'center', marginBottom: '24px' }}>
                                            <Avatar 
                                                size={100} 
                                                icon={<UserOutlined />} 
                                                style={{ backgroundColor: '#0f172a' }}
                                            />
                                            <div style={{ marginTop: '16px' }}>
                                                <Upload {...uploadProps}>
                                                    <Button icon={<UploadOutlined />}>Change Avatar</Button>
                                                </Upload>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                                <Input placeholder="Enter your full name" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                                                <Input placeholder="Enter your email" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="phone" label="Phone Number">
                                                <Input placeholder="Enter your phone number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="department" label="Department">
                                                <Select placeholder="Select department">
                                                    <Option value="IT Department">IT Department</Option>
                                                    <Option value="Medical Services">Medical Services</Option>
                                                    <Option value="Administration">Administration</Option>
                                                    <Option value="Finance">Finance</Option>
                                                    <Option value="Fleet Management">Fleet Management</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                                            Update Profile
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title="Account Information" style={{ borderRadius: '12px' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div>
                                        <Text type="secondary">User ID</Text>
                                        <div><Text strong>ADM001</Text></div>
                                    </div>
                                    <div>
                                        <Text type="secondary">Role</Text>
                                        <div><Tag color="blue">{userProfile.role}</Tag></div>
                                    </div>
                                    <div>
                                        <Text type="secondary">Last Login</Text>
                                        <div><Text>Today at 09:30 AM</Text></div>
                                    </div>
                                    <div>
                                        <Text type="secondary">Account Status</Text>
                                        <div><Tag color="success">Active</Tag></div>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane 
                    tab={
                        <span>
                            <LockOutlined />
                            Security
                        </span>
                    } 
                    key="security"
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card title="Change Password" style={{ borderRadius: '12px' }}>
                                <Form 
                                    form={passwordForm} 
                                    layout="vertical" 
                                    onFinish={handlePasswordChange}
                                >
                                    <Form.Item 
                                        name="currentPassword" 
                                        label="Current Password" 
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password placeholder="Enter current password" />
                                    </Form.Item>
                                    <Form.Item 
                                        name="newPassword" 
                                        label="New Password" 
                                        rules={[{ required: true, min: 8 }]}
                                    >
                                        <Input.Password placeholder="Enter new password" />
                                    </Form.Item>
                                    <Form.Item 
                                        name="confirmPassword" 
                                        label="Confirm New Password" 
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password placeholder="Confirm new password" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading} icon={<KeyOutlined />}>
                                            Change Password
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title="Security Settings" style={{ borderRadius: '12px' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Two-Factor Authentication</Text>
                                        <Switch defaultChecked />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Login Notifications</Text>
                                        <Switch defaultChecked />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Session Timeout</Text>
                                        <Switch defaultChecked />
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane 
                    tab={
                        <span>
                            <BellOutlined />
                            Notifications
                        </span>
                    } 
                    key="notifications"
                >
                    <Card title="Notification Preferences" style={{ borderRadius: '12px' }}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Title level={5}>System Notifications</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Email Notifications</Text>
                                        <Switch 
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(checked) => handleNotificationSettingsChange('emailNotifications', checked)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>SMS Notifications</Text>
                                        <Switch 
                                            checked={notificationSettings.smsNotifications}
                                            onChange={(checked) => handleNotificationSettingsChange('smsNotifications', checked)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Push Notifications</Text>
                                        <Switch 
                                            checked={notificationSettings.pushNotifications}
                                            onChange={(checked) => handleNotificationSettingsChange('pushNotifications', checked)}
                                        />
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Title level={5}>Alert Types</Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Maintenance Alerts</Text>
                                        <Switch 
                                            checked={notificationSettings.maintenanceAlerts}
                                            onChange={(checked) => handleNotificationSettingsChange('maintenanceAlerts', checked)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Low Stock Alerts</Text>
                                        <Switch 
                                            checked={notificationSettings.lowStockAlerts}
                                            onChange={(checked) => handleNotificationSettingsChange('lowStockAlerts', checked)}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text>Budget Alerts</Text>
                                        <Switch 
                                            checked={notificationSettings.budgetAlerts}
                                            onChange={(checked) => handleNotificationSettingsChange('budgetAlerts', checked)}
                                        />
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </TabPane>

                <TabPane 
                    tab={
                        <span>
                            <SettingOutlined />
                            System
                        </span>
                    } 
                    key="system"
                >
                    <Card title="System Configuration" style={{ borderRadius: '12px' }}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Title level={5}>Display Settings</Title>
                                <Form layout="vertical" initialValues={systemSettings}>
                                    <Form.Item label="Language">
                                        <Select onChange={(value) => handleSystemSettingsChange('language', value)}>
                                            <Option value="English">English</Option>
                                            <Option value="Luganda">Luganda</Option>
                                            <Option value="Swahili">Swahili</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Theme">
                                        <Select onChange={(value) => handleSystemSettingsChange('theme', value)}>
                                            <Option value="Light">Light</Option>
                                            <Option value="Dark">Dark</Option>
                                            <Option value="Auto">Auto</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Date Format">
                                        <Select onChange={(value) => handleSystemSettingsChange('dateFormat', value)}>
                                            <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                                            <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                                            <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Title level={5}>System Preferences</Title>
                                <Form layout="vertical" initialValues={systemSettings}>
                                    <Form.Item label="Auto Logout (minutes)">
                                        <Select onChange={(value) => handleSystemSettingsChange('autoLogout', value)}>
                                            <Option value={15}>15 minutes</Option>
                                            <Option value={30}>30 minutes</Option>
                                            <Option value={60}>1 hour</Option>
                                            <Option value={120}>2 hours</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Backup Frequency">
                                        <Select onChange={(value) => handleSystemSettingsChange('backupFrequency', value)}>
                                            <Option value="Daily">Daily</Option>
                                            <Option value="Weekly">Weekly</Option>
                                            <Option value="Monthly">Monthly</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Data Retention">
                                        <Select onChange={(value) => handleSystemSettingsChange('dataRetention', value)}>
                                            <Option value="3 years">3 years</Option>
                                            <Option value="5 years">5 years</Option>
                                            <Option value="7 years">7 years</Option>
                                            <Option value="10 years">10 years</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </TabPane>
            </Tabs>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Button 
                    type="primary" 
                    size="large" 
                    loading={loading}
                    onClick={handleSaveAllSettings}
                    icon={<SaveOutlined />}
                >
                    Save All Settings
                </Button>
            </div>
        </div>
    );
};

export default Settings;
