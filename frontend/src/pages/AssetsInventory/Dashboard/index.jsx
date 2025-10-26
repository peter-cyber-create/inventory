import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Modal, Form, Input, Select, DatePicker, InputNumber, message, Tag } from 'antd';
import { 
    DatabaseOutlined, 
    ToolOutlined, 
    UserOutlined, 
    DollarOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const AssetsInventoryDashboard = () => {

    const [assets, setAssets] = useState([
        { id: 1, name: 'Laptop Dell XPS', serialNo: 'DL-2024-001', category: 'IT Equipment', status: 'Active', assignedTo: 'IT Department', value: 3500000, purchaseDate: '2024-01-01' },
        { id: 2, name: 'Network Switch', serialNo: 'NS-2024-002', category: 'Networking', status: 'Active', assignedTo: 'IT Department', value: 1200000, purchaseDate: '2024-01-05' },
        { id: 3, name: 'Office Printer', serialNo: 'OP-2024-003', category: 'Office Equipment', status: 'Maintenance', assignedTo: 'Admin Office', value: 450000, purchaseDate: '2024-01-10' },
        { id: 4, name: 'Medical Scanner', serialNo: 'MS-2024-004', category: 'Medical Equipment', status: 'Active', assignedTo: 'Medical Ward', value: 8500000, purchaseDate: '2024-01-15' }
    ]);
    const [departments] = useState([
        { id: 1, name: 'IT Department', manager: 'John Doe', contact: '+256 701 111 111' },
        { id: 2, name: 'Medical Ward', manager: 'Dr. Jane Smith', contact: '+256 702 222 222' },
        { id: 3, name: 'Admin Office', manager: 'Mike Johnson', contact: '+256 703 333 333' },
        { id: 4, name: 'Finance Department', manager: 'Sarah Wilson', contact: '+256 704 444 444' }
    ]);
    const [maintenanceRecords, setMaintenanceRecords] = useState([
        { id: 1, asset: 'Office Printer', type: 'Preventive Maintenance', scheduledDate: '2024-01-20', estimatedCost: 150000, status: 'Scheduled', assignedTechnician: 'Tech Team' }
    ]);

    // Modal states
    const [addAssetModal, setAddAssetModal] = useState(false);
    const [maintenanceModal, setMaintenanceModal] = useState(false);
    const [assignAssetModal, setAssignAssetModal] = useState(false);
    const [viewAssetsModal, setViewAssetsModal] = useState(false);
    const [viewMaintenanceModal, setViewMaintenanceModal] = useState(false);

    // Form instances
    const [assetForm] = Form.useForm();
    const [maintenanceForm] = Form.useForm();
    const [assignmentForm] = Form.useForm();

    const handleAddAsset = () => {
        setAddAssetModal(true);
    };

    const handleAddAssetSubmit = (values) => {
        const newAsset = {
            id: assets.length + 1,
            name: values.name,
            serialNo: values.serialNo,
            category: values.category,
            status: 'Active',
            assignedTo: 'Unassigned',
            value: values.value,
            purchaseDate: values.purchaseDate.format('YYYY-MM-DD')
        };
        setAssets([...assets, newAsset]);
        message.success('Asset added successfully!');
        setAddAssetModal(false);
        assetForm.resetFields();
    };

    const handleScheduleMaintenance = () => {
        setMaintenanceModal(true);
    };

    const handleMaintenanceSubmit = (values) => {
        const newMaintenance = {
            id: maintenanceRecords.length + 1,
            asset: values.asset,
            type: values.type,
            scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
            estimatedCost: values.estimatedCost,
            status: 'Scheduled',
            assignedTechnician: values.assignedTechnician
        };
        setMaintenanceRecords([...maintenanceRecords, newMaintenance]);
        message.success('Maintenance scheduled successfully!');
        setMaintenanceModal(false);
        maintenanceForm.resetFields();
    };

    const handleAssignAsset = () => {
        setAssignAssetModal(true);
    };

    const handleAssignmentSubmit = (values) => {
        const updatedAssets = assets.map(asset => 
            asset.id === values.asset ? { ...asset, assignedTo: values.department } : asset
        );
        setAssets(updatedAssets);
        message.success('Asset assigned successfully!');
        setAssignAssetModal(false);
        assignmentForm.resetFields();
    };

    const handleViewAssets = () => {
        setViewAssetsModal(true);
    };

    const handleViewMaintenance = () => {
        setViewMaintenanceModal(true);
    };

    const getActiveAssetsCount = () => {
        return assets.filter(a => a.status === 'Active').length;
    };

    const getMaintenanceCount = () => {
        return assets.filter(a => a.status === 'Maintenance').length;
    };

    const getTotalValue = () => {
        return assets.reduce((total, a) => total + a.value, 0);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ margin: '0 0 20px 0', color: '#0f172a' }}>
                Assets Inventory
            </Title>

            {/* Simple Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Assets"
                            value={assets.length}
                            prefix={<DatabaseOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Active Assets"
                            value={getActiveAssetsCount()}
                            prefix={<DatabaseOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Under Maintenance"
                            value={getMaintenanceCount()}
                            prefix={<ToolOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Value"
                            value={`UGX ${(getTotalValue() / 1000000).toFixed(1)}M`}
                            prefix={<DollarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Simple Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12}>
                    <Card title="Quick Actions" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                block
                                onClick={handleAddAsset}
                            >
                                Add New Asset
                            </Button>
                            <Button 
                                icon={<ToolOutlined />} 
                                block
                                onClick={handleScheduleMaintenance}
                            >
                                Schedule Maintenance
                            </Button>
                            <Button 
                                icon={<UserOutlined />} 
                                block
                                onClick={handleAssignAsset}
                            >
                                Assign Asset
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card title="View Data" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                icon={<DatabaseOutlined />} 
                                block
                                onClick={handleViewAssets}
                            >
                                View All Assets ({assets.length})
                            </Button>
                            <Button 
                                icon={<ToolOutlined />} 
                                block
                                onClick={handleViewMaintenance}
                            >
                                View Maintenance Records ({maintenanceRecords.length})
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Add Asset Modal */}
            <Modal
                title="Add New Asset"
                open={addAssetModal}
                onCancel={() => setAddAssetModal(false)}
                footer={null}
                width={600}
            >
                <Form form={assetForm} onFinish={handleAddAssetSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Asset Name" rules={[{ required: true, message: 'Please enter asset name!' }]}>
                                <Input placeholder="e.g., Laptop Dell XPS" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="serialNo" label="Serial Number" rules={[{ required: true, message: 'Please enter serial number!' }]}>
                                <Input placeholder="e.g., DL-2024-001" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category!' }]}>
                                <Select placeholder="Select category">
                                    <Option value="IT Equipment">IT Equipment</Option>
                                    <Option value="Networking">Networking</Option>
                                    <Option value="Office Equipment">Office Equipment</Option>
                                    <Option value="Medical Equipment">Medical Equipment</Option>
                                    <Option value="Furniture">Furniture</Option>
                                    <Option value="Vehicles">Vehicles</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="value" label="Asset Value (UGX)" rules={[{ required: true, message: 'Please enter asset value!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="purchaseDate" label="Purchase Date" rules={[{ required: true, message: 'Please select purchase date!' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Asset
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Schedule Maintenance Modal */}
            <Modal
                title="Schedule Maintenance"
                open={maintenanceModal}
                onCancel={() => setMaintenanceModal(false)}
                footer={null}
                width={600}
            >
                <Form form={maintenanceForm} onFinish={handleMaintenanceSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="asset" label="Asset" rules={[{ required: true, message: 'Please select asset!' }]}>
                                <Select placeholder="Select asset">
                                    {assets.map(asset => (
                                        <Option key={asset.id} value={asset.name}>{asset.name} - {asset.serialNo}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="type" label="Maintenance Type" rules={[{ required: true, message: 'Please select maintenance type!' }]}>
                                <Select placeholder="Select maintenance type">
                                    <Option value="Preventive Maintenance">Preventive Maintenance</Option>
                                    <Option value="Corrective Maintenance">Corrective Maintenance</Option>
                                    <Option value="Emergency Repair">Emergency Repair</Option>
                                    <Option value="Software Update">Software Update</Option>
                                    <Option value="Hardware Upgrade">Hardware Upgrade</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="scheduledDate" label="Scheduled Date" rules={[{ required: true, message: 'Please select date!' }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="estimatedCost" label="Estimated Cost (UGX)" rules={[{ required: true, message: 'Please enter estimated cost!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="assignedTechnician" label="Assigned Technician" rules={[{ required: true, message: 'Please enter technician name!' }]}>
                        <Input placeholder="e.g., Tech Team" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Schedule Maintenance
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Assign Asset Modal */}
            <Modal
                title="Assign Asset to Department"
                open={assignAssetModal}
                onCancel={() => setAssignAssetModal(false)}
                footer={null}
                width={500}
            >
                <Form form={assignmentForm} onFinish={handleAssignmentSubmit} layout="vertical">
                    <Form.Item name="asset" label="Asset" rules={[{ required: true, message: 'Please select asset!' }]}>
                        <Select placeholder="Select asset">
                            {assets.map(asset => (
                                <Option key={asset.id} value={asset.id}>{asset.name} - {asset.serialNo}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department!' }]}>
                        <Select placeholder="Select department">
                            {departments.map(dept => (
                                <Option key={dept.id} value={dept.name}>{dept.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Assign Asset
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Assets Modal */}
            <Modal
                title="Assets Overview"
                open={viewAssetsModal}
                onCancel={() => setViewAssetsModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {assets.map(asset => (
                        <Card key={asset.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{asset.name}</Text>
                                    <br />
                                    <Text type="secondary">{asset.serialNo}</Text>
                                </Col>
                                <Col span={4}>
                                    <Tag color="blue">{asset.category}</Tag>
                                </Col>
                                <Col span={3}>
                                    <Tag color={asset.status === 'Active' ? 'success' : 'warning'}>
                                        {asset.status}
                                    </Tag>
                                </Col>
                                <Col span={4}>
                                    <Text>{asset.assignedTo}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text strong>UGX {asset.value.toLocaleString()}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text type="secondary">{asset.purchaseDate}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>

            {/* View Maintenance Modal */}
            <Modal
                title="Maintenance Records"
                open={viewMaintenanceModal}
                onCancel={() => setViewMaintenanceModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {maintenanceRecords.map(maintenance => (
                        <Card key={maintenance.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{maintenance.asset}</Text>
                                </Col>
                                <Col span={4}>
                                    <Tag color="blue">{maintenance.type}</Tag>
                                </Col>
                                <Col span={4}>
                                    <Text>{maintenance.scheduledDate}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text strong>UGX {maintenance.estimatedCost.toLocaleString()}</Text>
                                </Col>
                                <Col span={3}>
                                    <Tag color="orange">{maintenance.status}</Tag>
                                </Col>
                                <Col span={3}>
                                    <Text>{maintenance.assignedTechnician}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default AssetsInventoryDashboard;
