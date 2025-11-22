import React from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, Typography, Divider, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StandardForm = ({
    title,
    visible,
    onCancel,
    onSubmit,
    form,
    loading = false,
    initialValues = {},
    fields = [],
    showDivider = true,
    showAttachments = false,
    attachments = [],
    onAttachmentsChange,
    submitText = "Save",
    cancelText = "Cancel",
    width = 800,
    layout = "vertical"
}) => {

    const renderField = (field) => {
        const { name, label, type = 'text', required = false, placeholder, options = [], span = 8, ...props } = field;

        const fieldElement = (() => {
            switch (type) {
                case 'textarea':
                    return <TextArea rows={3} placeholder={placeholder} {...props} />;
                case 'select':
                    return (
                        <Select placeholder={placeholder} {...props}>
                            {options.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    );
                case 'date':
                    return <DatePicker style={{ width: '100%' }} {...props} />;
                case 'number':
                    return <Input type="number" placeholder={placeholder} {...props} />;
                case 'email':
                    return <Input type="email" placeholder={placeholder} {...props} />;
                case 'password':
                    return <Input.Password placeholder={placeholder} {...props} />;
                default:
                    return <Input placeholder={placeholder} {...props} />;
            }
        })();

        return (
            <Col span={span} key={name}>
                <Form.Item
                    name={name}
                    label={label}
                    rules={required ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }] : []}
                >
                    {fieldElement}
                </Form.Item>
            </Col>
        );
    };

    const renderFieldGroup = (group, groupIndex) => {
        if (group.fields) {
            return (
                <div key={groupIndex}>
                    {group.title && <Title level={4}>{group.title}</Title>}
                    <Row gutter={16}>
                        {group.fields.map((field, index) => renderField(field))}
                    </Row>
                    {group.showDivider && <Divider />}
                </div>
            );
        }
        return renderField(group);
    };

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            width={width}
            footer={null}
        >
            <Form
                form={form}
                layout={layout}
                onFinish={onSubmit}
                initialValues={initialValues}
            >
                {fields.map((field, index) => {
                    if (field.fields) {
                        return renderFieldGroup(field, index);
                    }
                    return (
                        <Row gutter={16} key={index}>
                            {renderField(field)}
                        </Row>
                    );
                })}

                {showDivider && <Divider />}

                {showAttachments && (
                    <>
                        <Title level={4}>Supporting Documents</Title>
                        <Upload
                            multiple
                            fileList={attachments}
                            onChange={onAttachmentsChange}
                            beforeUpload={() => false}
                            accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                        >
                            <Button icon={<UploadOutlined />}>Upload Documents</Button>
                        </Upload>
                        <Divider />
                    </>
                )}

                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onCancel}>
                            {cancelText}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {submitText}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default StandardForm;
