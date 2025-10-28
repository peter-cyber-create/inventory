import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Typography, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const SystemSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('Settings saved successfully');
        } catch (error) {
            message.error('Failed to save settings');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>System Settings</Title>
                <Text type="secondary">Configure system parameters and preferences</Text>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={{
                        systemName: 'Ministry of Health Uganda',
                        timezone: 'Africa/Kampala',
                        language: 'English',
                        dateFormat: 'DD/MM/YYYY',
                        sessionTimeout: 30,
                        autoLogout: true,
                        emailNotifications: true,
                        smsNotifications: false
                    }}
                >
                    <Title level={4}>General Settings</Title>
                    <Form.Item
                        name="systemName"
                        label="System Name"
                        rules={[{ required: true, message: 'Please enter system name' }]}
                    >
                        <Input placeholder="Enter system name" />
                    </Form.Item>

                    <Form.Item
                        name="timezone"
                        label="Timezone"
                        rules={[{ required: true, message: 'Please select timezone' }]}
                    >
                        <Select placeholder="Select timezone">
                            <Option value="Africa/Kampala">Africa/Kampala</Option>
                            <Option value="UTC">UTC</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="language"
                        label="Language"
                        rules={[{ required: true, message: 'Please select language' }]}
                    >
                        <Select placeholder="Select language">
                            <Option value="English">English</Option>
                            <Option value="Luganda">Luganda</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dateFormat"
                        label="Date Format"
                        rules={[{ required: true, message: 'Please select date format' }]}
                    >
                        <Select placeholder="Select date format">
                            <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                            <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                            <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        </Select>
                    </Form.Item>

                    <Title level={4}>Security Settings</Title>
                    <Form.Item
                        name="sessionTimeout"
                        label="Session Timeout (minutes)"
                        rules={[{ required: true, message: 'Please enter session timeout' }]}
                    >
                        <Input type="number" placeholder="Enter timeout in minutes" />
                    </Form.Item>

                    <Form.Item
                        name="autoLogout"
                        label="Auto Logout"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                    </Form.Item>

                    <Title level={4}>Notification Settings</Title>
                    <Form.Item
                        name="emailNotifications"
                        label="Email Notifications"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                    </Form.Item>

                    <Form.Item
                        name="smsNotifications"
                        label="SMS Notifications"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />}
                                loading={loading}
                            >
                                Save Settings
                            </Button>
                            <Button onClick={() => form.resetFields()}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SystemSettings;
