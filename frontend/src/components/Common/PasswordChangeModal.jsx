/**
 * Ministry of Health Uganda - Password Change Modal
 * Institutional design for secure password updates
 */
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space, Typography, Divider } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import API from '../../helpers/api';
import '../../theme/moh-institutional-theme.css';

const { Text } = Typography;

const PasswordChangeModal = ({ visible, onCancel, userId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await API.patch(`/api/users/${userId}/password`, {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });

            const data = response.data;

            if (data.status === 'success') {
                message.success('Password changed successfully');
                form.resetFields();
                onSuccess();
                onCancel();
            } else {
                message.error(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Error changing password');
        }
        setLoading(false);
    };

    return (
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
                    Change Password
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={520}
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
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Text type="secondary" style={{ 
                    display: 'block', 
                    marginBottom: '20px',
                    fontSize: '13px',
                    color: '#5A6872'
                }}>
                    Enter your current password and choose a new secure password. Passwords must be at least 6 characters long.
                </Text>

                <Form.Item
                    name="currentPassword"
                    label={<Text strong style={{ color: '#1A1A1A' }}>Current Password</Text>}
                    rules={[
                        { required: true, message: 'Please enter current password' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#5A6872' }} />}
                        placeholder="Enter current password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        style={{ borderRadius: '4px' }}
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={<Text strong style={{ color: '#1A1A1A' }}>New Password</Text>}
                    rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#5A6872' }} />}
                        placeholder="Enter new password (min. 6 characters)"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        style={{ borderRadius: '4px' }}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={<Text strong style={{ color: '#1A1A1A' }}>Confirm New Password</Text>}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm new password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#5A6872' }} />}
                        placeholder="Confirm new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        style={{ borderRadius: '4px' }}
                    />
                </Form.Item>

                <Divider style={{ margin: '16px 0' }} />
                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button 
                            onClick={onCancel}
                            style={{ borderRadius: '4px' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            style={{
                                background: '#006747',
                                borderColor: '#006747',
                                borderRadius: '4px',
                                fontWeight: 600
                            }}
                        >
                            Change Password
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PasswordChangeModal;
