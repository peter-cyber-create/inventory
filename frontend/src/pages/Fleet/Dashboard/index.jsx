import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { 
    CarOutlined, 
    ToolOutlined, 
    UserOutlined, 
    PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const FleetDashboard = () => {

    const [vehicles, setVehicles] = useState([
        { id: 1, plate: 'UG 1234A', model: 'Toyota Hilux', status: 'Active', driver: 'John Doe', lastMaintenance: '2024-01-01' },
        { id: 2, plate: 'UG 5678B', model: 'Nissan Patrol', status: 'Active', driver: 'Jane Smith', lastMaintenance: '2024-01-05' },
        { id: 3, plate: 'UG 9012C', model: 'Land Rover', status: 'Maintenance', driver: 'Mike Johnson', lastMaintenance: '2024-01-10' }
    ]);
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'John Doe', license: 'DL001', phone: '+256 701 234 567', status: 'Active' },
        { id: 2, name: 'Jane Smith', license: 'DL002', phone: '+256 702 345 678', status: 'Active' },
        { id: 3, name: 'Mike Johnson', license: 'DL003', phone: '+256 703 456 789', status: 'Active' }
    ]);
    const [maintenanceRecords, setMaintenanceRecords] = useState([
        { id: 1, vehicle: 'UG 9012C', type: 'Oil Change', date: '2024-01-15', cost: 150000, status: 'Scheduled' }
    ]);

    // Modal states
    const [addVehicleModal, setAddVehicleModal] = useState(false);
    const [addDriverModal, setAddDriverModal] = useState(false);
    const [maintenanceModal, setMaintenanceModal] = useState(false);
    const [viewFleetModal, setViewFleetModal] = useState(false);
    const [viewDriversModal, setViewDriversModal] = useState(false);

    // Form instances
    const [vehicleForm] = Form.useForm();
    const [driverForm] = Form.useForm();
    const [maintenanceForm] = Form.useForm();

    const handleAddVehicle = () => {
        setAddVehicleModal(true);
    };

    const handleAddVehicleSubmit = (values) => {
        const newVehicle = {
            id: vehicles.length + 1,
            plate: values.plate,
            model: values.model,
            status: 'Active',
            driver: values.driver || 'Unassigned',
            lastMaintenance: 'Never'
        };
        setVehicles([...vehicles, newVehicle]);
        message.success('Vehicle added successfully!');
        setAddVehicleModal(false);
        vehicleForm.resetFields();
    };

    const handleAddDriver = () => {
        setAddDriverModal(true);
    };

    const handleAddDriverSubmit = (values) => {
        const newDriver = {
            id: drivers.length + 1,
            name: values.name,
            license: values.license,
            phone: values.phone,
            status: 'Active'
        };
        setDrivers([...drivers, newDriver]);
        message.success('Driver added successfully!');
        setAddDriverModal(false);
        driverForm.resetFields();
    };

    const handleScheduleMaintenance = () => {
        setMaintenanceModal(true);
    };

    const handleMaintenanceSubmit = (values) => {
        const newMaintenance = {
            id: maintenanceRecords.length + 1,
            vehicle: values.vehicle,
            type: values.type,
            date: values.date.format('YYYY-MM-DD'),
            cost: values.cost,
            status: 'Scheduled'
        };
        setMaintenanceRecords([...maintenanceRecords, newMaintenance]);
        message.success('Maintenance scheduled successfully!');
        setMaintenanceModal(false);
        maintenanceForm.resetFields();
    };

    const handleViewFleet = () => {
        setViewFleetModal(true);
    };

    const handleViewDrivers = () => {
        setViewDriversModal(true);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ margin: '0 0 20px 0', color: '#0f172a' }}>
                Fleet Management
            </Title>

            {/* Simple Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Vehicles"
                            value={vehicles.length}
                            prefix={<CarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Active Vehicles"
                            value={vehicles.filter(v => v.status === 'Active').length}
                            prefix={<CarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Maintenance Due"
                            value={maintenanceRecords.filter(m => m.status === 'Scheduled').length}
                            prefix={<ToolOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Drivers"
                            value={drivers.length}
                            prefix={<UserOutlined style={{ color: '#0f172a' }} />}
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
                                onClick={handleAddVehicle}
                            >
                                Add New Vehicle
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
                                onClick={handleAddDriver}
                            >
                                Add New Driver
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card title="View Data" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                icon={<CarOutlined />} 
                                block
                                onClick={handleViewFleet}
                            >
                                View All Vehicles ({vehicles.length})
                            </Button>
                            <Button 
                                icon={<UserOutlined />} 
                                block
                                onClick={handleViewDrivers}
                            >
                                View All Drivers ({drivers.length})
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Add Vehicle Modal */}
            <Modal
                title="Add New Vehicle"
                open={addVehicleModal}
                onCancel={() => setAddVehicleModal(false)}
                footer={null}
                width={500}
            >
                <Form form={vehicleForm} onFinish={handleAddVehicleSubmit} layout="vertical">
                    <Form.Item name="plate" label="License Plate" rules={[{ required: true, message: 'Please enter license plate!' }]}>
                        <Input placeholder="e.g., UG 1234A" />
                    </Form.Item>
                    <Form.Item name="model" label="Vehicle Model" rules={[{ required: true, message: 'Please enter vehicle model!' }]}>
                        <Input placeholder="e.g., Toyota Hilux" />
                    </Form.Item>
                    <Form.Item name="driver" label="Assigned Driver">
                        <Select placeholder="Select driver" allowClear>
                            {drivers.map(driver => (
                                <Option key={driver.id} value={driver.name}>{driver.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Vehicle
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Add Driver Modal */}
            <Modal
                title="Add New Driver"
                open={addDriverModal}
                onCancel={() => setAddDriverModal(false)}
                footer={null}
                width={500}
            >
                <Form form={driverForm} onFinish={handleAddDriverSubmit} layout="vertical">
                    <Form.Item name="name" label="Driver Name" rules={[{ required: true, message: 'Please enter driver name!' }]}>
                        <Input placeholder="e.g., John Doe" />
                    </Form.Item>
                    <Form.Item name="license" label="Driver License" rules={[{ required: true, message: 'Please enter driver license!' }]}>
                        <Input placeholder="e.g., DL001" />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number!' }]}>
                        <Input placeholder="e.g., +256 701 234 567" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Driver
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
                width={500}
            >
                <Form form={maintenanceForm} onFinish={handleMaintenanceSubmit} layout="vertical">
                    <Form.Item name="vehicle" label="Vehicle" rules={[{ required: true, message: 'Please select vehicle!' }]}>
                        <Select placeholder="Select vehicle">
                            {vehicles.map(vehicle => (
                                <Option key={vehicle.id} value={vehicle.plate}>{vehicle.plate} - {vehicle.model}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="type" label="Maintenance Type" rules={[{ required: true, message: 'Please select maintenance type!' }]}>
                        <Select placeholder="Select maintenance type">
                            <Option value="Oil Change">Oil Change</Option>
                            <Option value="Brake Service">Brake Service</Option>
                            <Option value="Tire Rotation">Tire Rotation</Option>
                            <Option value="Engine Tune-up">Engine Tune-up</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Scheduled Date" rules={[{ required: true, message: 'Please select date!' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="cost" label="Estimated Cost (UGX)" rules={[{ required: true, message: 'Please enter estimated cost!' }]}>
                        <Input type="number" placeholder="e.g., 150000" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Schedule Maintenance
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Fleet Modal */}
            <Modal
                title="Fleet Overview"
                open={viewFleetModal}
                onCancel={() => setViewFleetModal(false)}
                footer={null}
                width={800}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {vehicles.map(vehicle => (
                        <Card key={vehicle.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text strong>{vehicle.plate}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text>{vehicle.model}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text type={vehicle.status === 'Active' ? 'success' : 'warning'}>{vehicle.status}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text>{vehicle.driver}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>

            {/* View Drivers Modal */}
            <Modal
                title="Drivers Overview"
                open={viewDriversModal}
                onCancel={() => setViewDriversModal(false)}
                footer={null}
                width={800}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {drivers.map(driver => (
                        <Card key={driver.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Text strong>{driver.name}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text>{driver.license}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text>{driver.phone}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text type="success">{driver.status}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default FleetDashboard;