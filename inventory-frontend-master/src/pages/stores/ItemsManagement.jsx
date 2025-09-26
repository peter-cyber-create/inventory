import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Badge,
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
  WarningOutlined
} from '@ant-design/icons';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;

const ItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    fetchItems();
    fetchSuppliers();
    fetchLocations();
    fetchCategories();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await storesService.getItems({
        page: pagination.current,
        limit: pagination.pageSize,
        search: filters.search,
        category: filters.category,
        status: filters.status
      });

      if (response.success) {
        setItems(response.data.items);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await storesService.getActiveSuppliers();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await storesService.getActiveLocations();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await storesService.getItemCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue({
      ...record,
      supplier_id: record.supplier?.supplier_id,
      location_id: record.location?.location_id
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await storesService.deleteItem(id);
      if (response.success) {
        message.success('Item deactivated successfully');
        fetchItems();
      }
    } catch (error) {
      message.error('Failed to deactivate item');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        const response = await storesService.updateItem(editingItem.item_id, values);
        if (response.success) {
          message.success('Item updated successfully');
        }
      } else {
        const response = await storesService.createItem(values);
        if (response.success) {
          message.success('Item created successfully');
        }
      }
      setModalVisible(false);
      fetchItems();
    } catch (error) {
      message.error(editingItem ? 'Failed to update item' : 'Failed to create item');
    }
  };

  const handleTableChange = (paginationData) => {
    setPagination(paginationData);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getStockStatus = (item) => {
    const totalStock = item.stockBalances?.reduce((sum, balance) => sum + balance.current_quantity, 0) || 0;
    
    if (totalStock === 0) {
      return <Badge status="error" text="Out of Stock" />;
    } else if (totalStock <= item.reorder_level) {
      return <Badge status="warning" text="Low Stock" />;
    } else {
      return <Badge status="success" text="In Stock" />;
    }
  };

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      fixed: 'left',
      width: 120
    },
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Unit of Measure',
      dataIndex: 'unit_of_measure',
      key: 'unit_of_measure',
      width: 120
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorder_level',
      key: 'reorder_level',
      width: 100,
      align: 'center'
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      width: 120,
      align: 'right',
      render: (cost) => `UGX ${Number(cost).toLocaleString()}`
    },
    {
      title: 'Current Stock',
      key: 'current_stock',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const totalStock = record.stockBalances?.reduce((sum, balance) => sum + balance.current_quantity, 0) || 0;
        const isLowStock = totalStock <= record.reorder_level;
        
        return (
          <div>
            <div style={{ color: isLowStock ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
              {totalStock}
            </div>
            {isLowStock && totalStock > 0 && (
              <Tooltip title="Low Stock Alert">
                <WarningOutlined style={{ color: '#faad14', fontSize: '12px' }} />
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      title: 'Stock Status',
      key: 'stock_status',
      width: 120,
      render: (_, record) => getStockStatus(record)
    },
    {
      title: 'Supplier',
      key: 'supplier',
      width: 150,
      ellipsis: true,
      render: (_, record) => record.supplier?.supplier_name || 'N/A'
    },
    {
      title: 'Location',
      key: 'location',
      width: 120,
      ellipsis: true,
      render: (_, record) => record.location?.location_name || 'N/A'
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
              title="Are you sure you want to deactivate this item?"
              onConfirm={() => handleDelete(record.item_id)}
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

  const unitOptions = [
    'Piece', 'Box', 'Carton', 'Bottle', 'Vial', 'Packet', 
    'Kg', 'Gram', 'Litre', 'ML', 'Meter', 'Roll', 'Set', 'Dozen'
  ];

  const categoryOptions = [
    'Medical', 'Office', 'IT', 'Maintenance', 'Laboratory', 
    'Pharmacy', 'Cleaning', 'Kitchen', 'Other'
  ];

  return (
    <div className="items-management">
      <Card>
        <div className="page-header">
          <div>
            <h2>Items Management</h2>
            <p>Manage inventory items, stock levels, and item information</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add New Item
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Items" 
              value={pagination.total} 
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Active Items" 
              value={items.filter(item => item.is_active).length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Low Stock Items" 
              value={items.filter(item => {
                const totalStock = item.stockBalances?.reduce((sum, balance) => sum + balance.current_quantity, 0) || 0;
                return totalStock <= item.reorder_level;
              }).length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Out of Stock" 
              value={items.filter(item => {
                const totalStock = item.stockBalances?.reduce((sum, balance) => sum + balance.current_quantity, 0) || 0;
                return totalStock === 0;
              }).length}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search items..."
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Category"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('category', value)}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Status"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Option value="all">All</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Items Table */}
        <Table
          columns={columns}
          dataSource={items}
          rowKey="item_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
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
                name="item_code"
                label="Item Code"
                rules={[{ required: true, message: 'Please enter item code' }]}
              >
                <Input placeholder="Enter unique item code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="item_name"
                label="Item Name"
                rules={[{ required: true, message: 'Please enter item name' }]}
              >
                <Input placeholder="Enter item name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categoryOptions.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sub_category"
                label="Sub Category"
              >
                <Input placeholder="Enter sub category" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit_of_measure"
                label="Unit of Measure"
                rules={[{ required: true, message: 'Please select unit' }]}
              >
                <Select placeholder="Select unit">
                  {unitOptions.map(unit => (
                    <Option key={unit} value={unit}>{unit}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="reorder_level"
                label="Reorder Level"
                rules={[{ required: true, message: 'Please enter reorder level' }]}
              >
                <Input type="number" min={0} placeholder="Minimum stock level" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="max_level"
                label="Maximum Level"
              >
                <Input type="number" min={0} placeholder="Maximum stock level" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit_cost"
                label="Unit Cost (UGX)"
              >
                <Input type="number" min={0} step={0.01} placeholder="Cost per unit" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplier_id"
                label="Supplier"
              >
                <Select placeholder="Select supplier" allowClear>
                  {suppliers.map(supplier => (
                    <Option key={supplier.supplier_id} value={supplier.supplier_id}>
                      {supplier.supplier_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location_id"
                label="Default Location"
              >
                <Select placeholder="Select location" allowClear>
                  {locations.map(location => (
                    <Option key={location.location_id} value={location.location_id}>
                      {location.location_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter item description" />
          </Form.Item>

          {editingItem && (
            <Form.Item
              name="is_active"
              label="Status"
              valuePropName="checked"
            >
              <Select>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <style jsx>{`
        .items-management {
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

export default ItemsManagement;
