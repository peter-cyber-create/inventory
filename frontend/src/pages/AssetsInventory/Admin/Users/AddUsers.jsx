import React, { useState } from "react";
import { Form, Row } from "antd";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import {
    MOHForm,
    MOHFormSection,
    MOHFormField,
    MOHInput,
    MOHSelect,
    MOHFormActions
} from "../../../../design-system/MOHFormSystem";
import "../../../../design-system/moh-forms.css";

const AddUsers = ({ close, refresh }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const roleOptions = [
        { value: 'admin', label: 'Administrator' },
        { value: 'it', label: 'IT Manager' },
        { value: 'store', label: 'Store Manager' },
        { value: 'garage', label: 'Fleet Manager' },
        { value: 'finance', label: 'Finance Manager' },
        { value: 'user', label: 'User' }
    ];

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const response = await API.post('/api/users/register', values);
            console.log(response);
            setLoading(false);
            form.resetFields();
            close();
            refresh();
            toast.success('User Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            const errorMessage = error.response?.data?.message || "Error while adding new user";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="card custom-card">
            <div className="card-body">
                <MOHForm
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <MOHFormSection
                        title="User Information"
                        subtitle="Enter user details"
                        required
                    >
                        <Row gutter={[16, 0]}>
                            <MOHFormField name="username" label="User Name" required span={12} type="text">
                                <MOHInput placeholder="Enter username" />
                            </MOHFormField>
                            <MOHFormField name="password" label="Password" required span={12} type="password">
                                <MOHInput type="password" placeholder="Enter password" />
                            </MOHFormField>
                            <MOHFormField name="firstname" label="First Name" required span={12} type="text">
                                <MOHInput placeholder="Enter first name" />
                            </MOHFormField>
                            <MOHFormField name="lastname" label="Last Name" required span={12} type="text">
                                <MOHInput placeholder="Enter last name" />
                            </MOHFormField>
                            <MOHFormField name="role" label="Role" required span={12}>
                                <MOHSelect 
                                    placeholder="Select role"
                                    options={roleOptions}
                                />
                            </MOHFormField>
                            <MOHFormField name="facilityId" label="Facility ID" span={12} type="text">
                                <MOHInput placeholder="Enter facility ID" />
                            </MOHFormField>
                            <MOHFormField name="phoneNo" label="Phone Number" required span={12} type="text">
                                <MOHInput placeholder="Enter phone number" />
                            </MOHFormField>
                            <MOHFormField name="email" label="Email" required span={12} type="email">
                                <MOHInput type="email" placeholder="Enter email address" />
                            </MOHFormField>
                        </Row>
                    </MOHFormSection>
                    
                    <MOHFormActions
                        onCancel={close}
                        onSubmit={() => form.submit()}
                        loading={loading}
                        submitText="Add New User"
                        cancelText="Cancel"
                    />
                </MOHForm>
            </div>
        </div>
    )
}

export default AddUsers