import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, message, Tag } from 'antd';
import { 
    ShopOutlined, 
    ContainerOutlined, 
    FileTextOutlined, 
    DollarOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const StoresDashboard = () => {

    const [products, setProducts] = useState([
        { id: 1, name: 'Laptop Dell Latitude', category: 'Electronics', currentStock: 15, minStock: 10, unitPrice: 2500000, supplier: 'Tech Solutions Ltd' },
        { id: 2, name: 'Office Chairs', category: 'Furniture', currentStock: 8, minStock: 15, unitPrice: 150000, supplier: 'Furniture World' },
        { id: 3, name: 'Network Cables', category: 'Networking', currentStock: 5, minStock: 15, unitPrice: 25000, supplier: 'Network Pro' },
        { id: 4, name: 'Medical Supplies', category: 'Medical', currentStock: 25, minStock: 25, unitPrice: 50000, supplier: 'Med Supply Co' }
    ]);
    const [requisitions, setRequisitions] = useState([
        { id: 1, product: 'Laptop Dell Latitude', requester: 'IT Department', quantity: 5, date: '2024-01-15', status: 'Pending', priority: 'High' },
        { id: 2, product: 'Office Chairs', requester: 'HR Department', quantity: 12, date: '2024-01-14', status: 'Approved', priority: 'Medium' },
        { id: 3, product: 'Medical Supplies', requester: 'Medical Ward', quantity: 50, date: '2024-01-13', status: 'Completed', priority: 'High' }
    ]);
    const [suppliers] = useState([
        { id: 1, name: 'Tech Solutions Ltd', contact: '+256 701 111 111', email: 'info@techsolutions.ug', category: 'Electronics' },
        { id: 2, name: 'Furniture World', contact: '+256 702 222 222', email: 'sales@furnitureworld.ug', category: 'Furniture' },
        { id: 3, name: 'Network Pro', contact: '+256 703 333 333', email: 'contact@networkpro.ug', category: 'Networking' }
    ]);

    // Modal states
    const [addProductModal, setAddProductModal] = useState(false);
    const [processRequisitionModal, setProcessRequisitionModal] = useState(false);
    const [generateReportModal, setGenerateReportModal] = useState(false);
    const [viewInventoryModal, setViewInventoryModal] = useState(false);
    const [viewRequisitionsModal, setViewRequisitionsModal] = useState(false);

    // Form instances
    const [productForm] = Form.useForm();
    const [requisitionForm] = Form.useForm();

    const handleAddProduct = () => {
        setAddProductModal(true);
    };

    const handleAddProductSubmit = (values) => {
        const newProduct = {
            id: products.length + 1,
            name: values.name,
            category: values.category,
            currentStock: values.currentStock,
            minStock: values.minStock,
            unitPrice: values.unitPrice,
            supplier: values.supplier
        };
        setProducts([...products, newProduct]);
        message.success('Product added successfully!');
        setAddProductModal(false);
        productForm.resetFields();
    };

    const handleProcessRequisition = () => {
        setProcessRequisitionModal(true);
    };

    const handleProcessRequisitionSubmit = (values) => {
        const newRequisition = {
            id: requisitions.length + 1,
            product: values.product,
            requester: values.requester,
            quantity: values.quantity,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            priority: values.priority
        };
        setRequisitions([...requisitions, newRequisition]);
        message.success('Requisition processed successfully!');
        setProcessRequisitionModal(false);
        requisitionForm.resetFields();
    };

    const handleGenerateReport = () => {
        setGenerateReportModal(true);
    };

    const handleViewInventory = () => {
        setViewInventoryModal(true);
    };

    const handleViewRequisitions = () => {
        setViewRequisitionsModal(true);
    };

    const getLowStockCount = () => {
        return products.filter(p => p.currentStock < p.minStock).length;
    };

    const getTotalValue = () => {
        return products.reduce((total, p) => total + (p.currentStock * p.unitPrice), 0);
    };

    const getPendingRequisitionsCount = () => {
        return requisitions.filter(r => r.status === 'Pending').length;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ margin: '0 0 20px 0', color: '#0f172a' }}>
                Stores Management
            </Title>

            {/* Simple Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Products"
                            value={products.length}
                            prefix={<ShopOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Low Stock Items"
                            value={getLowStockCount()}
                            prefix={<ContainerOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Pending Requisitions"
                            value={getPendingRequisitionsCount()}
                            prefix={<FileTextOutlined style={{ color: '#0f172a' }} />}
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
                                onClick={handleAddProduct}
                            >
                                Add New Product
                            </Button>
                            <Button 
                                icon={<ContainerOutlined />} 
                                block
                                onClick={handleProcessRequisition}
                            >
                                Process Requisition
                            </Button>
                            <Button 
                                icon={<FileTextOutlined />} 
                                block
                                onClick={handleGenerateReport}
                            >
                                Generate Report
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card title="View Data" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                icon={<ShopOutlined />} 
                                block
                                onClick={handleViewInventory}
                            >
                                View All Products ({products.length})
                            </Button>
                            <Button 
                                icon={<FileTextOutlined />} 
                                block
                                onClick={handleViewRequisitions}
                            >
                                View All Requisitions ({requisitions.length})
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Add Product Modal */}
            <Modal
                title="Add New Product"
                open={addProductModal}
                onCancel={() => setAddProductModal(false)}
                footer={null}
                width={600}
            >
                <Form form={productForm} onFinish={handleAddProductSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter product name!' }]}>
                                <Input placeholder="e.g., Laptop Dell Latitude" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category!' }]}>
                                <Select placeholder="Select category">
                                    <Option value="Electronics">Electronics</Option>
                                    <Option value="Furniture">Furniture</Option>
                                    <Option value="Networking">Networking</Option>
                                    <Option value="Medical">Medical</Option>
                                    <Option value="Office Supplies">Office Supplies</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="currentStock" label="Current Stock" rules={[{ required: true, message: 'Please enter current stock!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="minStock" label="Minimum Stock" rules={[{ required: true, message: 'Please enter minimum stock!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="unitPrice" label="Unit Price (UGX)" rules={[{ required: true, message: 'Please enter unit price!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="supplier" label="Supplier" rules={[{ required: true, message: 'Please select supplier!' }]}>
                        <Select placeholder="Select supplier">
                            {suppliers.map(supplier => (
                                <Option key={supplier.id} value={supplier.name}>{supplier.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Product
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Process Requisition Modal */}
            <Modal
                title="Process Requisition"
                open={processRequisitionModal}
                onCancel={() => setProcessRequisitionModal(false)}
                footer={null}
                width={600}
            >
                <Form form={requisitionForm} onFinish={handleProcessRequisitionSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="product" label="Product" rules={[{ required: true, message: 'Please select product!' }]}>
                                <Select placeholder="Select product">
                                    {products.map(product => (
                                        <Option key={product.id} value={product.name}>{product.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="requester" label="Requester" rules={[{ required: true, message: 'Please enter requester!' }]}>
                                <Input placeholder="e.g., IT Department" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity!' }]}>
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Please select priority!' }]}>
                                <Select placeholder="Select priority">
                                    <Option value="Low">Low</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="High">High</Option>
                                    <Option value="Urgent">Urgent</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Process Requisition
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Generate Report Modal */}
            <Modal
                title="Generate Inventory Report"
                open={generateReportModal}
                onCancel={() => setGenerateReportModal(false)}
                footer={null}
                width={500}
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                    <Title level={4}>Report Generated Successfully!</Title>
                    <Text type="secondary">
                        Your inventory report has been generated and is ready for download.
                    </Text>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" onClick={() => setGenerateReportModal(false)}>
                            Download Report
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* View Inventory Modal */}
            <Modal
                title="Inventory Overview"
                open={viewInventoryModal}
                onCancel={() => setViewInventoryModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {products.map(product => (
                        <Card key={product.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{product.name}</Text>
                                </Col>
                                <Col span={4}>
                                    <Tag color="blue">{product.category}</Tag>
                                </Col>
                                <Col span={3}>
                                    <Text type={product.currentStock < product.minStock ? 'danger' : 'success'}>
                                        Stock: {product.currentStock}
                                    </Text>
                                </Col>
                                <Col span={3}>
                                    <Text>Min: {product.minStock}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text strong>UGX {product.unitPrice.toLocaleString()}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text type="secondary">{product.supplier}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>

            {/* View Requisitions Modal */}
            <Modal
                title="Requisitions Overview"
                open={viewRequisitionsModal}
                onCancel={() => setViewRequisitionsModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {requisitions.map(requisition => (
                        <Card key={requisition.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{requisition.product}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text>{requisition.requester}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text strong>Qty: {requisition.quantity}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text type="secondary">{requisition.date}</Text>
                                </Col>
                                <Col span={4}>
                                    <Tag color={
                                        requisition.status === 'Completed' ? 'success' : 
                                        requisition.status === 'Approved' ? 'blue' : 
                                        requisition.status === 'Pending' ? 'orange' : 'red'
                                    }>
                                        {requisition.status}
                                    </Tag>
                                </Col>
                                <Col span={4}>
                                    <Tag color={
                                        requisition.priority === 'Urgent' ? 'red' : 
                                        requisition.priority === 'High' ? 'orange' : 
                                        requisition.priority === 'Medium' ? 'blue' : 'green'
                                    }>
                                        {requisition.priority}
                                    </Tag>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default StoresDashboard;
