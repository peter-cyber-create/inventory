/**
 * Example User Form - Professional Implementation
 * 
 * This is an EXAMPLE showing how forms should be structured
 * using the MOH Form System. Review this before implementation.
 */

import React, { useState } from 'react';
import { Form, message } from 'antd';
import {
  MOHForm,
  MOHFormSection,
  MOHFormField,
  MOHInput,
  MOHSelect,
  MOHTextArea,
  MOHButton,
  MOHFormActions
} from '../../design-system/MOHFormSystem';
import '../../design-system/moh-forms.css';

const ExampleUserForm = ({ visible, onCancel, onSubmit, initialValues = {} }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Role options
  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'it', label: 'IT Manager' },
    { value: 'store', label: 'Store Manager' },
    { value: 'garage', label: 'Fleet Manager' },
    { value: 'finance', label: 'Finance Manager' },
    { value: 'user', label: 'User' }
  ];

  // Department options (would come from API)
  const departmentOptions = [
    { value: 1, label: 'IT Department' },
    { value: 2, label: 'Medical Services' },
    { value: 3, label: 'Administration' },
    { value: 4, label: 'Finance' }
  ];

  // Module options
  const moduleOptions = [
    { value: 'ict', label: 'ICT/Assets' },
    { value: 'stores', label: 'Stores' },
    { value: 'fleet', label: 'Fleet' },
    { value: 'finance', label: 'Finance' }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('User created successfully!');
      onSubmit?.(values);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    localStorage.setItem('userFormDraft', JSON.stringify(values));
    message.info('Draft saved successfully');
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 12px 32px rgba(0, 103, 71, 0.15)'
      }}>
        {/* Form Header */}
        <div style={{
          background: 'linear-gradient(135deg, #006747 0%, #004D35 100%)',
          padding: '24px 32px',
          borderRadius: '16px 16px 0 0',
          color: '#FFFFFF'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            Create New User
          </h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
            Add a new user to the system with appropriate permissions
          </p>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px' }}>
          <MOHForm
            form={form}
            onFinish={handleSubmit}
            initialValues={initialValues}
          >
            {/* Section 1: Personal Information */}
            <MOHFormSection
              title="Personal Information"
              subtitle="Basic details about the user"
              required
            >
              <Row gutter={[16, 0]}>
                <MOHFormField name="firstname" label="First Name" required span={12}>
                  <MOHInput placeholder="Enter first name" />
                </MOHFormField>

                <MOHFormField name="lastname" label="Last Name" required span={12}>
                  <MOHInput placeholder="Enter last name" />
                </MOHFormField>

                <MOHFormField name="email" label="Email Address" required span={24}>
                  <MOHInput type="email" placeholder="user@moh.go.ug" />
                </MOHFormField>

                <MOHFormField name="phone" label="Phone Number" required span={12}>
                  <MOHInput type="tel" placeholder="+256 XXX XXX XXX" />
                </MOHFormField>

                <MOHFormField name="designation" label="Designation" span={12}>
                  <MOHInput placeholder="e.g., Senior Officer" />
                </MOHFormField>

                <MOHFormField name="health_email" label="Health Email" span={24}>
                  <MOHInput 
                    type="email" 
                    placeholder="user@health.go.ug (optional)" 
                  />
                </MOHFormField>
              </Row>
            </MOHFormSection>

            {/* Section 2: Account Details */}
            <MOHFormSection
              title="Account Details"
              subtitle="Login credentials and permissions"
              required
            >
              <Row gutter={[16, 0]}>
                <MOHFormField name="username" label="Username" required span={12}>
                  <MOHInput placeholder="Choose a username" />
                </MOHFormField>

                <MOHFormField name="role" label="Role" required span={12}>
                  <MOHSelect 
                    placeholder="Select user role"
                    options={roleOptions}
                  />
                </MOHFormField>

                <MOHFormField name="password" label="Password" required span={12}>
                  <MOHInput type="password" placeholder="Enter password" />
                </MOHFormField>

                <MOHFormField name="confirmPassword" label="Confirm Password" required span={12}>
                  <MOHInput type="password" placeholder="Confirm password" />
                </MOHFormField>

                <MOHFormField name="is_active" label="Account Status" span={24} valuePropName="checked">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ color: '#5A6872', fontSize: '14px' }}>
                      Active (User can login)
                    </span>
                  </div>
                </MOHFormField>
              </Row>
            </MOHFormSection>

            {/* Section 3: Department Assignment */}
            <MOHFormSection
              title="Department Assignment"
              subtitle="Assign user to department and module"
            >
              <Row gutter={[16, 0]}>
                <MOHFormField name="department_id" label="Department" required span={12}>
                  <MOHSelect 
                    placeholder="Select department"
                    options={departmentOptions}
                  />
                </MOHFormField>

                <MOHFormField name="module" label="Module" span={12}>
                  <MOHSelect 
                    placeholder="Select module (optional)"
                    options={moduleOptions}
                  />
                </MOHFormField>

                <MOHFormField name="depart" label="Department Name (Legacy)" span={12}>
                  <MOHInput placeholder="Department name" />
                </MOHFormField>

                <MOHFormField name="facilityid" label="Facility" span={12}>
                  <MOHInput type="number" placeholder="Facility ID" />
                </MOHFormField>

                <MOHFormField name="notes" label="Additional Notes" span={24}>
                  <MOHTextArea 
                    rows={3}
                    placeholder="Any additional information about this user..."
                  />
                </MOHFormField>
              </Row>
            </MOHFormSection>

            {/* Form Actions */}
            <MOHFormActions
              onCancel={onCancel}
              onSubmit={() => form.submit()}
              loading={loading}
              submitText="Create User"
              cancelText="Cancel"
              showSaveDraft={true}
              onSaveDraft={handleSaveDraft}
            />
          </MOHForm>
        </div>
      </div>
    </div>
  );
};

export default ExampleUserForm;
















