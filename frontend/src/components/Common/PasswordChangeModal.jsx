import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import API from '../../helpers/api';

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
            title="Change Password"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[
                        { required: true, message: 'Please enter current password' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter current password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    rules={[
                        { required: true, message: 'Please confirm new password' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Change Password
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PasswordChangeModal;
