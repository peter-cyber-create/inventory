import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Select, 
    Row, 
    Col, 
    Statistic, 
    Tag, 
    Space,
    Popconfirm,
    message,
    Tooltip,
    Typography,
    Alert
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    ReloadOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { toast } from "react-toastify";
import API from '../../../helpers/api';
import notificationService from '../../../services/notificationService';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const Maintenance = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        thisMonth: 0,
        upcoming: 0,
        overdue: 0
    });

    useEffect(() => {
        fetchMaintenance();
        fetchAssets();
    }, []);

    const fetchMaintenance = async () => {
        setLoading(true);
        try {
            const response = await API.get('/api/maintenance');
            const maintenanceData = response.data.maintenance || [];
            setMaintenance(maintenanceData);
            calculateStats(maintenanceData);
        } catch (error) {
            console.error('Error fetching maintenance:', error);
            message.error('Failed to fetch maintenance records');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await API.get('/api/assets');
            setAssets(response.data.assets || []);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const calculateStats = (data) => {
        const now = moment();
        const thisMonth = now.month();
        const thisYear = now.year();

        const stats = {
            total: data.length,
            thisMonth: data.filter(item => 
                moment(item.servicedOn).month() === thisMonth && 
                moment(item.servicedOn).year() === thisYear
            ).length,
            upcoming: data.filter(item => 
                moment(item.nextService).isAfter(now) && 
                moment(item.nextService).isBefore(now.clone().add(30, 'days'))
            ).length,
            overdue: data.filter(item => 
                moment(item.nextService).isBefore(now)
            ).length
        };
        setStats(stats);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                servicedOn: values.servicedOn.format('YYYY-MM-DD'),
                nextService: values.nextService.format('YYYY-MM-DD'),
                user: JSON.parse(localStorage.getItem('user'))?.username || 'System'
            };

            if (editMode) {
                await API.put(`/maintenance/${currentRecord.id}`, formData);
                message.success('Maintenance record updated successfully');
                notificationService.assets(
                    'Maintenance Updated',
                    `Maintenance record for ${values.taskName} has been updated`,
                    'success',
                    'medium'
                );
            } else {
                await API.post('/api/maintenance', formData);
                message.success('Maintenance record created successfully');
                notificationService.assets(
                    'Maintenance Scheduled',
                    `New maintenance task "${values.taskName}" has been scheduled`,
                    'success',
                    'medium'
                );
            }

            fetchMaintenance();
            handleModalClose();
        } catch (error) {
            console.error('Error submitting maintenance:', error);
            message.error('Failed to save maintenance record');
            notificationService.assets(
                'Maintenance Error',
                'Failed to save maintenance record. Please try again.',
                'error',
                'high'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setEditMode(true);
        form.setFieldsValue({
            ...record,
            servicedOn: moment(record.servicedOn),
            nextService: moment(record.nextService)
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await API.delete(`/maintenance/${id}`);
            message.success('Maintenance record deleted successfully');
            notificationService.assets(
                'Maintenance Deleted',
                'Maintenance record has been removed from the system',
                'info',
                'low'
            );
            fetchMaintenance();
        } catch (error) {
            console.error('Error deleting maintenance:', error);
            message.error('Failed to delete maintenance record');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditMode(false);
        setCurrentRecord(null);
        form.resetFields();
    };

    const getMaintenanceStatus = (nextServiceDate) => {
        const now = moment();
        const nextService = moment(nextServiceDate);
        
        if (nextService.isBefore(now)) {
            return <Tag color="red">Overdue</Tag>;
        } else if (nextService.isBefore(now.clone().add(7, 'days'))) {
            return <Tag color="orange">Due Soon</Tag>;
        } else if (nextService.isBefore(now.clone().add(30, 'days'))) {
            return <Tag color="yellow">Upcoming</Tag>;
        } else {
            return <Tag color="green">Scheduled</Tag>;
        }
    };

    const columns = [
        {
            title: 'Asset ID',
            dataIndex: 'assetId',
            key: 'assetId',
            width: 100,
        },
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Serviced By',
            dataIndex: 'servicedBy',
            key: 'servicedBy',
            width: 150,
        },
        {
            title: 'Service Date',
            dataIndex: 'servicedOn',
            key: 'servicedOn',
            width: 120,
            render: (date) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Next Service',
            dataIndex: 'nextService',
            key: 'nextService',
            width: 120,
            render: (date) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Status',
            dataIndex: 'nextService',
            key: 'status',
            width: 120,
            render: (date) => getMaintenanceStatus(date)
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this maintenance record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Title level={3} style={{ margin: 0 }}>
                                    <ToolOutlined /> Asset Maintenance Management
                                </Title>
                            </Col>
                            <Col>
                                <Space>
                                    <Button 
                                        icon={<ReloadOutlined />} 
                                        onClick={fetchMaintenance}
                                        loading={loading}
                                    >
                                        Refresh
                                    </Button>
                                    <Button 
                                        icon={<ExportOutlined />} 
                                        onClick={() => message.info('Export functionality coming soon')}
                                    >
                                        Export
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => setModalVisible(true)}
                                    >
                                        Schedule Maintenance
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Statistics Cards */}
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Maintenance Records"
                            value={stats.total}
                            prefix={<ToolOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="This Month"
                            value={stats.thisMonth}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Upcoming (30 days)"
                            value={stats.upcoming}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Overdue"
                            value={stats.overdue}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>

                {/* Alerts */}
                {stats.overdue > 0 && (
                    <Col span={24}>
                        <Alert
                            message={`You have ${stats.overdue} overdue maintenance task(s)`}
                            type="error"
                            showIcon
                            closable
                        />
                    </Col>
                )}

                {stats.upcoming > 0 && (
                    <Col span={24}>
                        <Alert
                            message={`You have ${stats.upcoming} maintenance task(s) due in the next 30 days`}
                            type="warning"
                            showIcon
                            closable
                        />
                    </Col>
                )}

                {/* Maintenance Table */}
                <Col span={24}>
                    <Card title="Maintenance Records">
                        <Table
                            columns={columns}
                            dataSource={maintenance}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => 
                                    `${range[0]}-${range[1]} of ${total} items`
                            }}
                            scroll={{ x: 1000 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Maintenance Modal */}
            <Modal
                title={editMode ? "Edit Maintenance Record" : "Schedule New Maintenance"}
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="assetId"
                                label="Asset"
                                rules={[{ required: true, message: 'Please select an asset' }]}
                            >
                                <Select
                                    placeholder="Select Asset"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {assets.map(asset => (
                                        <Option key={asset.id} value={asset.id}>
                                            {asset.serialNo} - {asset.brand} {asset.model}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="servicedBy"
                                label="Serviced By"
                                rules={[{ required: true, message: 'Please enter who serviced the asset' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Enter service provider" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="servicedOn"
                                label="Service Date"
                                rules={[{ required: true, message: 'Please select service date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="nextService"
                                label="Next Service Date"
                                rules={[{ required: true, message: 'Please select next service date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="taskName"
                        label="Task Name"
                        rules={[{ required: true, message: 'Please enter task name' }]}
                    >
                        <Input prefix={<FileTextOutlined />} placeholder="Enter maintenance task name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <TextArea 
                            rows={4} 
                            placeholder="Enter detailed description of maintenance work"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleModalClose}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editMode ? 'Update' : 'Schedule'} Maintenance
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Maintenance;