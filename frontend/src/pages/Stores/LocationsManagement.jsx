import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Select,
  TreeSelect
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  BankOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;

const LocationsManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: 'active'
  });

  const locationTypes = [
    { value: 'warehouse', label: 'Warehouse', icon: <BankOutlined /> },
    { value: 'store', label: 'Store', icon: <HomeOutlined /> },
    { value: 'department', label: 'Department', icon: <BankOutlined /> },
    { value: 'section', label: 'Section', icon: <HomeOutlined /> }
  ];

  useEffect(() => {
    fetchLocations();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await storesService.getLocations({
        page: pagination.current,
        limit: pagination.pageSize,
        search: filters.search,
        type: filters.type,
        status: filters.status
      });

      if (response.success) {
        setLocations(response.data.locations);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLocation(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingLocation(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id) => {
    try {
      const response = await storesService.deleteLocation(id);
      if (response.success) {
        message.success('Location deactivated successfully');
        fetchLocations();
      }
    } catch (error) {
      message.error('Failed to deactivate location');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLocation) {
        const response = await storesService.updateLocation(editingLocation.location_id, values);
        if (response.success) {
          message.success('Location updated successfully');
        }
      } else {
        const response = await storesService.createLocation(values);
        if (response.success) {
          message.success('Location created successfully');
        }
      }
      setModalVisible(false);
      fetchLocations();
    } catch (error) {
      message.error(editingLocation ? 'Failed to update location' : 'Failed to create location');
    }
  };

  const handleTableChange = (paginationData) => {
    setPagination(paginationData);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTypeFilter = (value) => {
    setFilters(prev => ({ ...prev, type: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getLocationTypeIcon = (type) => {
    const locationTypeObj = locationTypes.find(lt => lt.value === type);
    return locationTypeObj ? locationTypeObj.icon : <HomeOutlined />;
  };

  const getLocationTypeColor = (type) => {
    const colors = {
      warehouse: 'blue',
      store: 'green',
      department: 'orange',
      section: 'purple'
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      title: 'Location Code',
      dataIndex: 'location_code',
      key: 'location_code',
      fixed: 'left',
      width: 120,
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Location Name',
      dataIndex: 'location_name',
      key: 'location_name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Type',
      dataIndex: 'location_type',
      key: 'location_type',
      width: 120,
      render: (type) => (
        <Tag color={getLocationTypeColor(type)} icon={getLocationTypeIcon(type)}>
          {type?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Parent Location',
      dataIndex: 'parent_location_name',
      key: 'parent_location_name',
      width: 150,
      ellipsis: true,
      render: (name) => name || 'Root Level'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Manager',
      dataIndex: 'manager_name',
      key: 'manager_name',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity) => capacity ? `${capacity} units` : 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => {/* Handle view */}}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Deactivate">
            <Popconfirm
              title="Are you sure you want to deactivate this location?"
              onConfirm={() => handleDelete(record.location_id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="locations-management">
      <Card>
        <div className="page-header">
          <div>
            <h2>Locations Management</h2>
            <p>Manage storage locations, warehouses, and departments</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add New Location
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Locations" 
              value={pagination.total} 
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Warehouses" 
              value={locations.filter(loc => loc.location_type === 'warehouse').length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Stores" 
              value={locations.filter(loc => loc.location_type === 'store').length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Departments" 
              value={locations.filter(loc => loc.location_type === 'department').length} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>

        {/* Search and Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search locations..."
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Filter by type"
                allowClear
                style={{ width: '100%' }}
                onChange={handleTypeFilter}
              >
                {locationTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Locations Table */}
        <Table
          columns={columns}
          dataSource={locations}
          rowKey="location_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} locations`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location_code"
                label="Location Code"
                rules={[{ required: true, message: 'Please enter location code' }]}
              >
                <Input placeholder="Enter location code (e.g., WH001)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location_name"
                label="Location Name"
                rules={[{ required: true, message: 'Please enter location name' }]}
              >
                <Input placeholder="Enter location name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location_type"
                label="Location Type"
                rules={[{ required: true, message: 'Please select location type' }]}
              >
                <Select placeholder="Select location type">
                  {locationTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parent_location_id"
                label="Parent Location"
              >
                <TreeSelect
                  placeholder="Select parent location"
                  allowClear
                  treeDefaultExpandAll
                  // Note: This would need to be populated with location hierarchy
                  treeData={[]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter location description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manager_name"
                label="Manager Name"
              >
                <Input placeholder="Enter manager name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Capacity"
              >
                <Input 
                  type="number" 
                  placeholder="Enter capacity (units)"
                  addonAfter="units"
                />
              </Form.Item>
            </Col>
          </Row>

          {editingLocation && (
            <Form.Item
              name="is_active"
              label="Status"
              valuePropName="checked"
            >
              <Input type="checkbox" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <style jsx>{`
        .locations-management {
          padding: 24px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        
        .page-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .page-header p {
          margin: 4px 0 0 0;
          color: #8c8c8c;
        }
        
        .filters-section {
          background: #fafafa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default LocationsManagement;
