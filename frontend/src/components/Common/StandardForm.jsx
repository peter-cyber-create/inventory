import React from 'react';
import { Modal, Form, Input, Button, Space, Row, Col, Typography, Divider, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  MOHFormSection,
  MOHFormField,
  MOHInput,
  MOHSelect,
  MOHTextArea,
  MOHButton,
  MOHFormActions
} from '../../design-system/MOHFormSystem';
import '../../design-system/moh-forms.css';

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
                    return <MOHTextArea rows={3} placeholder={placeholder} {...props} />;
                case 'select':
                    return (
                        <MOHSelect 
                            placeholder={placeholder} 
                            options={options}
                            {...props} 
                        />
                    );
                case 'date':
                    return <DatePicker style={{ width: '100%', height: '44px', borderRadius: '8px' }} {...props} />;
                case 'number':
                    return <MOHInput type="number" placeholder={placeholder} {...props} />;
                case 'email':
                    return <MOHInput type="email" placeholder={placeholder} {...props} />;
                case 'password':
                    return <MOHInput type="password" placeholder={placeholder} {...props} />;
                default:
                    return <MOHInput placeholder={placeholder} {...props} />;
            }
        })();

        return (
            <MOHFormField
                key={name}
                name={name}
                label={label}
                required={required}
                span={span}
            >
                {fieldElement}
            </MOHFormField>
        );
    };

    const renderFieldGroup = (group, groupIndex) => {
        if (group.fields) {
            return (
                <MOHFormSection
                    key={groupIndex}
                    title={group.title}
                    subtitle={group.subtitle}
                    required={group.required}
                >
                    <Row gutter={[16, 0]}>
                        {group.fields.map((field, index) => renderField(field))}
                    </Row>
                </MOHFormSection>
            );
        }
        return renderField(group);
    };

    return (
        <Modal
            title={
                <div style={{
                    background: 'linear-gradient(135deg, #006747 0%, #004D35 100%)',
                    margin: '-24px -24px 0 -24px',
                    padding: '24px 32px',
                    color: '#FFFFFF',
                    borderRadius: '8px 8px 0 0'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {title}
                    </h3>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            width={width}
            footer={null}
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
        >
            <div style={{ padding: '32px' }}>
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
                            <Row gutter={[16, 0]} key={index}>
                                {renderField(field)}
                            </Row>
                        );
                    })}

                    {showDivider && <Divider style={{ margin: '24px 0' }} />}

                    {showAttachments && (
                        <MOHFormSection
                            title="Supporting Documents"
                            subtitle="Upload relevant documents"
                        >
                            <Upload
                                multiple
                                fileList={attachments}
                                onChange={onAttachmentsChange}
                                beforeUpload={() => false}
                                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                            >
                                <Button icon={<UploadOutlined />} style={{
                                    height: '44px',
                                    borderRadius: '8px',
                                    border: '2px dashed #E1E5E9',
                                    background: '#FAFBFC',
                                    width: '100%'
                                }}>
                                    Upload Documents
                                </Button>
                            </Upload>
                        </MOHFormSection>
                    )}

                    <MOHFormActions
                        onCancel={onCancel}
                        onSubmit={() => form.submit()}
                        loading={loading}
                        submitText={submitText}
                        cancelText={cancelText}
                    />
                </Form>
            </div>
        </Modal>
    );
};

export default StandardForm;
