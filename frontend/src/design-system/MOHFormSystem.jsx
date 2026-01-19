/**
 * Ministry of Health Uganda - Professional Form System
 * 
 * This component provides a standardized, professional form structure
 * that ensures consistency across all forms in the system.
 * 
 * Features:
 * - Responsive design (mobile-first)
 * - Official MOH Uganda color scheme
 * - Professional government aesthetics
 * - Accessible and user-friendly
 * - Custom, non-AI-generated appearance
 */

import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Switch, Upload, Button, Space, Divider, Row, Col, Card } from 'antd';
import { 
  UploadOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  SaveOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * MOHFormSection - Professional form section wrapper
 * Provides visual grouping and hierarchy
 */
export const MOHFormSection = ({ 
  title, 
  subtitle, 
  children, 
  required = false,
  collapsible = false,
  defaultCollapsed = false 
}) => {
  return (
    <div 
      className="moh-form-section"
      style={{
        marginBottom: '32px',
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E1E5E9',
        overflow: 'hidden'
      }}
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <div 
          style={{
            background: 'linear-gradient(135deg, #FAFBFC 0%, #F5F7FA 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid #E1E5E9'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {title && (
                <h3 
                  style={{
                    margin: 0,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {title}
                  {required && (
                    <span style={{ color: '#E53935', fontSize: '1rem' }}>*</span>
                  )}
                </h3>
              )}
              {subtitle && (
                <p 
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.875rem',
                    color: '#5A6872',
                    fontWeight: 400
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Section Content */}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
};

/**
 * MOHFormField - Standardized form field wrapper
 * Ensures consistent styling and behavior
 */
export const MOHFormField = ({ 
  label, 
  name, 
  required = false, 
  tooltip,
  children,
  span = 24,
  ...props 
}) => {
  return (
    <Col xs={24} sm={24} md={span} lg={span}>
      <Form.Item
        name={name}
        label={
          <span style={{ 
            fontWeight: 600, 
            fontSize: '14px',
            color: '#1A1A1A'
          }}>
            {label}
            {required && (
              <span style={{ color: '#E53935', marginLeft: '4px' }}>*</span>
            )}
          </span>
        }
        rules={required ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }] : []}
        tooltip={tooltip}
        {...props}
      >
        {children}
      </Form.Item>
    </Col>
  );
};

/**
 * MOHInput - Styled input component
 */
export const MOHInput = ({ 
  placeholder, 
  prefix, 
  suffix,
  type = 'text',
  ...props 
}) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      prefix={prefix}
      suffix={suffix}
      style={{
        height: '44px',
        borderRadius: '8px',
        border: '1px solid #E1E5E9',
        fontSize: '16px',
        transition: 'all 0.2s ease'
      }}
      className="moh-input"
      {...props}
    />
  );
};

/**
 * MOHSelect - Styled select component
 */
export const MOHSelect = ({ 
  placeholder = 'Please select',
  options = [],
  ...props 
}) => {
  return (
    <Select
      placeholder={placeholder}
      style={{
        height: '44px',
        borderRadius: '8px'
      }}
      className="moh-select"
      {...props}
    >
      {options.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

/**
 * MOHTextArea - Styled textarea component
 */
export const MOHTextArea = ({ 
  rows = 4,
  placeholder,
  ...props 
}) => {
  return (
    <TextArea
      rows={rows}
      placeholder={placeholder}
      style={{
        borderRadius: '8px',
        border: '1px solid #E1E5E9',
        fontSize: '16px',
        resize: 'vertical'
      }}
      className="moh-textarea"
      {...props}
    />
  );
};

/**
 * MOHButton - Styled button components
 */
export const MOHButton = {
  Primary: ({ children, icon, ...props }) => (
    <Button
      type="primary"
      icon={icon}
      style={{
        height: '44px',
        borderRadius: '8px',
        background: '#006747',
        borderColor: '#006747',
        fontWeight: 600,
        fontSize: '16px',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 103, 71, 0.2)'
      }}
      className="moh-btn-primary"
      {...props}
    >
      {children}
    </Button>
  ),
  
  Secondary: ({ children, icon, ...props }) => (
    <Button
      icon={icon}
      style={{
        height: '44px',
        borderRadius: '8px',
        border: '2px solid #006747',
        color: '#006747',
        fontWeight: 600,
        fontSize: '16px',
        padding: '0 24px',
        background: 'transparent'
      }}
      className="moh-btn-secondary"
      {...props}
    >
      {children}
    </Button>
  ),
  
  Danger: ({ children, icon, ...props }) => (
    <Button
      icon={icon}
      danger
      style={{
        height: '44px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '16px',
        padding: '0 24px'
      }}
      className="moh-btn-danger"
      {...props}
    >
      {children}
    </Button>
  )
};

/**
 * MOHFormActions - Standardized form action buttons
 */
export const MOHFormActions = ({ 
  onCancel, 
  onSubmit, 
  loading = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  showSaveDraft = false,
  onSaveDraft
}) => {
  return (
    <div 
      style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #E1E5E9',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
      <Space size="middle">
        {onCancel && (
          <MOHButton.Secondary onClick={onCancel}>
            {cancelText}
          </MOHButton.Secondary>
        )}
        
        {showSaveDraft && onSaveDraft && (
          <Button
            onClick={onSaveDraft}
            style={{
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #E1E5E9',
              color: '#5A6872',
              fontWeight: 600,
              fontSize: '16px',
              padding: '0 24px'
            }}
          >
            <SaveOutlined /> Save Draft
          </Button>
        )}
        
        {onSubmit && (
          <MOHButton.Primary 
            onClick={onSubmit}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            {submitText}
          </MOHButton.Primary>
        )}
      </Space>
    </div>
  );
};

/**
 * MOHForm - Main form wrapper with professional styling
 */
export const MOHForm = ({ 
  children, 
  form,
  onFinish,
  initialValues,
  layout = 'vertical',
  ...props 
}) => {
  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
      initialValues={initialValues}
      style={{
        background: '#FAFBFC',
        padding: '24px',
        borderRadius: '12px'
      }}
      {...props}
    >
      <Row gutter={[24, 0]}>
        {children}
      </Row>
    </Form>
  );
};

// Export all components
export default {
  MOHForm,
  MOHFormSection,
  MOHFormField,
  MOHInput,
  MOHSelect,
  MOHTextArea,
  MOHButton,
  MOHFormActions
};






