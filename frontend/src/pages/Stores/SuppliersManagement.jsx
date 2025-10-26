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
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { storesService } from '../../services/storesService';

const { Search } = Input;

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSuppliers();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await storesService.getSuppliers({
        page: pagination.current,
        limit: pagination.pageSize,
        search: filters.search,
        status: filters.status
      });

      if (response.success) {
        setSuppliers(response.data.suppliers);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSupplier(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingSupplier(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id) => {
    try {
      const response = await storesService.deleteSupplier(id);
      if (response.success) {
        message.success('Supplier deactivated successfully');
        fetchSuppliers();
      }
    } catch (error) {
      message.error('Failed to deactivate supplier');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingSupplier) {
        const response = await storesService.updateSupplier(editingSupplier.supplier_id, values);
        if (response.success) {
          message.success('Supplier updated successfully');
        }
      } else {
        const response = await storesService.createSupplier(values);
        if (response.success) {
          message.success('Supplier created successfully');
        }
      }
      setModalVisible(false);
      fetchSuppliers();
    } catch (error) {
      message.error(editingSupplier ? 'Failed to update supplier' : 'Failed to create supplier');
    }
  };

  const handleTableChange = (paginationData) => {
    setPagination(paginationData);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      fixed: 'left',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 130,
      render: (phone) => phone ? (
        <div>
          <PhoneOutlined style={{ marginRight: 4 }} />
          {phone}
        </div>
      ) : 'N/A'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
      render: (email) => email ? (
        <div>
          <MailOutlined style={{ marginRight: 4 }} />
          {email}
        </div>
      ) : 'N/A'
    },
    {
      title: 'TIN Number',
      dataIndex: 'tin_number',
      key: 'tin_number',
      width: 130
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true
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
              title="Are you sure you want to deactivate this supplier?"
              onConfirm={() => handleDelete(record.supplier_id)}
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
    <div className="suppliers-management">
      <Card>
        <div className="page-header">
          <div>
            <h2>Suppliers Management</h2>
            <p>Manage supplier information and contact details</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add New Supplier
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic 
              title="Total Suppliers" 
              value={pagination.total} 
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Active Suppliers" 
              value={suppliers.filter(supplier => supplier.is_active).length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Inactive Suppliers" 
              value={suppliers.filter(supplier => !supplier.is_active).length} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>

        {/* Search and Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Search
                placeholder="Search suppliers..."
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Suppliers Table */}
        <Table
          columns={columns}
          dataSource={suppliers}
          rowKey="supplier_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} suppliers`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
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
                name="supplier_name"
                label="Supplier Name"
                rules={[{ required: true, message: 'Please enter supplier name' }]}
              >
                <Input placeholder="Enter supplier name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact_person"
                label="Contact Person"
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: 'email', message: 'Please enter valid email' }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tin_number"
                label="TIN Number"
              >
                <Input placeholder="Enter TIN number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea rows={3} placeholder="Enter supplier address" />
          </Form.Item>

          {editingSupplier && (
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
        .suppliers-management {
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

export default SuppliersManagement;
