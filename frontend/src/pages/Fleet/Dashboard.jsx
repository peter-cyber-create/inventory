import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Button, Space } from 'antd';
import { 
    CarOutlined, 
    ToolOutlined, 
    WarningOutlined, 
    CheckCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import PageLayout from '../../components/Layout/PageLayout';
import StandardTable from '../../components/Common/StandardTable';

const { Title, Text } = Typography;

const FleetDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeVehicles: 0,
        maintenanceDue: 0,
        totalMileage: 0
    });
    const [recentVehicles, setRecentVehicles] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch vehicles data
            const vehiclesResponse = await fetch('http://localhost:5000/api/v/vehicle');
            const vehiclesData = await vehiclesResponse.json();
            
            if (vehiclesData.status === 'success') {
                const vehicles = vehiclesData.vehicles || [];
                setStats({
                    totalVehicles: vehicles.length,
                    activeVehicles: vehicles.filter(vehicle => vehicle.status === 'Active').length,
                    maintenanceDue: vehicles.filter(vehicle => vehicle.maintenance_due).length,
                    totalMileage: vehicles.reduce((sum, vehicle) => sum + (parseInt(vehicle.mileage) || 0), 0)
                });
                
                // Set recent vehicles (last 5)
                setRecentVehicles(vehicles.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
    };

    const handleViewVehicle = (vehicle) => {
        console.log('View vehicle:', vehicle);
    };

    const handleEditVehicle = (vehicle) => {
        console.log('Edit vehicle:', vehicle);
    };

    const handleDeleteVehicle = (vehicle) => {
        console.log('Delete vehicle:', vehicle);
    };

    const vehicleColumns = [
        {
            title: 'Vehicle ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Number Plate',
            dataIndex: 'new_number_plate',
            key: 'new_number_plate',
        },
        {
            title: 'Make/Model',
            key: 'make_model',
            render: (_, record) => `${record.make || ''} ${record.model || ''}`,
        },
        {
            title: 'Year',
            dataIndex: 'YOM',
            key: 'YOM',
        },
        {
            title: 'Mileage',
            dataIndex: 'mileage',
            key: 'mileage',
            render: (mileage) => mileage ? `${mileage} km` : 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'orange'}>
                    {status || 'Unknown'}
                </Tag>
            ),
        },
    ];

    return (
        <PageLayout
            title="Fleet Management Dashboard"
            subtitle="Manage vehicles, maintenance, and fleet operations"
        >
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Vehicles"
                            value={stats.totalVehicles}
                            prefix={<CarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Vehicles"
                            value={stats.activeVehicles}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Maintenance Due"
                            value={stats.maintenanceDue}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Mileage"
                            value={stats.totalMileage}
                            suffix="km"
                            precision={0}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Vehicles */}
            <StandardTable
                title="Recent Vehicles"
                dataSource={recentVehicles}
                columns={vehicleColumns}
                loading={loading}
                onCreateClick={() => console.log('Create vehicle')}
                onViewClick={handleViewVehicle}
                onEditClick={handleEditVehicle}
                onDeleteClick={handleDeleteVehicle}
                createButtonText="Add Vehicle"
                rowKey="id"
            />

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ marginTop: '24px' }}>
                <Space wrap>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Add New Vehicle
                    </Button>
                    <Button icon={<EyeOutlined />}>
                        View All Vehicles
                    </Button>
                    <Button icon={<ToolOutlined />}>
                        Schedule Maintenance
                    </Button>
                    <Button>
                        Generate Report
                    </Button>
                </Space>
            </Card>
        </PageLayout>
    );
};

export default FleetDashboard;
