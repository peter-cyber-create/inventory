import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Tag,
  Tooltip,
  Divider,
  Typography,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const GRN = () => {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  const statusConfig = {
    'pending': { color: 'orange', label: 'Pending' },
    'approved': { color: 'green', label: 'Approved' },
    'rejected': { color: 'red', label: 'Rejected' }
  };

  useEffect(() => {
    fetchInitialData();
    fetchGRNs();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [suppliersRes, locationsRes, itemsRes] = await Promise.all([
        storesService.getActiveSuppliers(),
        storesService.getActiveLocations(),
        storesService.getItems({ status: 'active' })
      ]);

      if (suppliersRes.data.success) setSuppliers(suppliersRes.data.data);
      if (locationsRes.data.success) setLocations(locationsRes.data.data);
      if (itemsRes.data.success) setItems(itemsRes.data.data.items);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const fetchGRNs = async () => {
    try {
      setLoading(true);
      const response = await storesService.getGRNs({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.data.success) {
        setGrns(response.data.data.grn);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch GRNs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedGRN(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      received_date: dayjs(),
      status: 'pending'
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getGRN(record.grn_id);
      if (response.data.success) {
        setSelectedGRN(response.data.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load GRN details');
    }
  };

  const handleApprove = async (grnId, action) => {
    try {
      const response = await storesService[action === 'approve' ? 'approveGRN' : 'rejectGRN'](grnId, {
        remarks: ''
      });

      if (response.data.success) {
        message.success(`GRN ${action}d successfully`);
        fetchGRNs();
      }
    } catch (error) {
      message.error(`Failed to ${action} GRN`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (items.length === 0) {
        message.error('Please add at least one item to the GRN');
        return;
      }

      const grnData = {
        ...values,
        received_date: values.received_date.format('YYYY-MM-DD'),
        items: items.map(item => ({
          item_id: item.item_id,
          quantity_received: item.quantity_received,
          unit_cost: item.unit_cost,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date,
          condition: item.condition
        }))
      };

      const response = await storesService.createGRN(grnData);
      
      if (response.data.success) {
        message.success('GRN created successfully');
        setModalVisible(false);
        fetchGRNs();
      }
    } catch (error) {
      message.error('Failed to create GRN');
    }
  };

  const addItem = () => {
    const newItem = {
      key: Date.now(),
      item_id: null,
      quantity_received: 0,
      unit_cost: 0,
      batch_number: '',
      expiry_date: null,
      condition: 'good'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (key) => {
    setItems(items.filter(item => item.key !== key));
  };

  const updateItem = (key, field, value) => {
    const updatedItems = items.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const itemColumns = [
    {
      title: 'Item',
      dataIndex: 'item_id',
      key: 'item_id',
      width: 250,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateItem(record.key, 'item_id', val)}
          placeholder="Select item"
          style={{ width: '100%' }}
          showSearch
          optionFilterProp="children"
        >
          {items.map(item => (
            <Option key={item.item_id} value={item.item_id}>
              {item.item_name} ({item.item_code})
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Quantity Received',
      dataIndex: 'quantity_received',
      key: 'quantity_received',
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantity_received', val)}
          style={{ width: '100%' }}
          min={1}
        />
      )
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      width: 120,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'unit_cost', val)}
          style={{ width: '100%' }}
          min={0}
          step={0.01}
        />
      )
    },
    {
      title: 'Batch Number',
      dataIndex: 'batch_number',
      key: 'batch_number',
      width: 150,
      render: (value, record) => (
        <Input
          value={value}
          onChange={(e) => updateItem(record.key, 'batch_number', e.target.value)}
          placeholder="Batch number"
        />
      )
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      width: 150,
      render: (value, record) => (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(date) => updateItem(record.key, 'expiry_date', date?.format('YYYY-MM-DD'))}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 120,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateItem(record.key, 'condition', val)}
          style={{ width: '100%' }}
        >
          <Option value="good">Good</Option>
          <Option value="damaged">Damaged</Option>
          <Option value="expired">Expired</Option>
        </Select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      )
    }
  ];

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
      key: 'grn_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Received Date',
      dataIndex: 'received_date',
      key: 'received_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'supplier_name'],
      key: 'supplier',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Location',
      dataIndex: ['location', 'location_name'],
      key: 'location',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      align: 'right',
      render: (amount) => `UGX ${amount?.toLocaleString() || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = statusConfig[status] || statusConfig['pending'];
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckOutlined />}
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record.grn_id, 'approve')}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseOutlined />}
                  danger
                  onClick={() => handleApprove(record.grn_id, 'reject')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="grn">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Goods Received Notes (GRN)</Title>
            <Text type="secondary">Manage incoming stock receipts</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              New GRN
            </Button>
          </Space>
        </div>

        <Alert
          message="GRN Workflow"
          description="Create GRN → Review → Approve/Reject → Stock Updated"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Input
                placeholder="Search GRNs..."
                allowClear
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.label}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* GRNs Table */}
        <Table
          columns={columns}
          dataSource={grns}
          rowKey="grn_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} GRNs`
          }}
          onChange={setPagination}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title="New GRN"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="grn_number"
                label="GRN Number"
                rules={[{ required: true, message: 'Please enter GRN number' }]}
              >
                <Input placeholder="Auto-generated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="received_date"
                label="Received Date"
                rules={[{ required: true, message: 'Please select received date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="received_by"
                label="Received By"
                rules={[{ required: true, message: 'Please enter receiver name' }]}
              >
                <Input placeholder="Enter receiver name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplier_id"
                label="Supplier"
                rules={[{ required: true, message: 'Please select supplier' }]}
              >
                <Select placeholder="Select supplier">
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
                label="Location"
                rules={[{ required: true, message: 'Please select location' }]}
              >
                <Select placeholder="Select location">
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
            name="remarks"
            label="Remarks"
          >
            <TextArea rows={3} placeholder="Enter any remarks" />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4}>Received Items</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Add Item
            </Button>
          </div>

          <Table
            columns={itemColumns}
            dataSource={items}
            pagination={false}
            scroll={{ x: 1000 }}
            size="small"
          />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit"
                disabled={items.length === 0}
              >
                Create GRN
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`GRN Details - ${selectedGRN?.grn_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedGRN && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>GRN Number:</Text> {selectedGRN.grn_number}
              </Col>
              <Col span={12}>
                <Text strong>Received Date:</Text> {dayjs(selectedGRN.received_date).format('DD/MM/YYYY')}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Supplier:</Text> {selectedGRN.supplier?.supplier_name}
              </Col>
              <Col span={12}>
                <Text strong>Location:</Text> {selectedGRN.location?.location_name}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Received By:</Text> {selectedGRN.received_by}
              </Col>
              <Col span={12}>
                <Text strong>Total Amount:</Text> UGX {selectedGRN.total_amount?.toLocaleString()}
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Remarks:</Text>
              <p>{selectedGRN.remarks || 'No remarks'}</p>
            </div>

            <Divider />

            <Title level={5}>Received Items</Title>
            <Table
              dataSource={selectedGRN.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity', dataIndex: 'quantity_received', key: 'quantity_received', align: 'right' },
                { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', align: 'right' },
                { title: 'Total Cost', dataIndex: 'total_cost', key: 'total_cost', align: 'right' },
                { title: 'Batch', dataIndex: 'batch_number', key: 'batch_number' },
                { title: 'Condition', dataIndex: 'condition', key: 'condition' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .grn {
          padding: 24px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
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

export default GRN;
