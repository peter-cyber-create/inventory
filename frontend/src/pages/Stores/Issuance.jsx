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
  DeleteOutlined,
  SearchOutlined,
  SendOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Issuance = () => {
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    issued_to: '',
    location_id: ''
  });

  const statusConfig = {
    'pending': { color: 'orange', label: 'Pending' },
    'completed': { color: 'green', label: 'Completed' },
    'cancelled': { color: 'red', label: 'Cancelled' }
  };

  useEffect(() => {
    fetchInitialData();
    fetchIssuances();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, locationsRes, requisitionsRes] = await Promise.all([
        storesService.getItems({ status: 'active' }),
        storesService.getActiveLocations(),
        storesService.getRequisitions({ status: 'approved' })
      ]);

      if (itemsRes.data.success) setItems(itemsRes.data.data.items);
      if (locationsRes.data.success) setLocations(locationsRes.data.data);
      if (requisitionsRes.data.success) setRequisitions(requisitionsRes.data.data.requisitions);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      const response = await storesService.getIssuances({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.data.success) {
        setIssuances(response.data.data.issuances);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch issuances');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedIssuance(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      issued_date: dayjs(),
      status: 'completed'
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getIssuance(record.issuance_id);
      if (response.data.success) {
        setSelectedIssuance(response.data.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load issuance details');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (items.length === 0) {
        message.error('Please add at least one item to the issuance');
        return;
      }

      const issuanceData = {
        ...values,
        issued_date: values.issued_date.format('YYYY-MM-DD'),
        items: items.map(item => ({
          item_id: item.item_id,
          quantity_issued: item.quantity_issued,
          unit_cost: item.unit_cost,
          batch_number: item.batch_number
        }))
      };

      const response = await storesService.createIssuance(issuanceData);
      
      if (response.data.success) {
        message.success('Issuance created successfully');
        setModalVisible(false);
        fetchIssuances();
      }
    } catch (error) {
      message.error('Failed to create issuance');
    }
  };

  const addItem = () => {
    const newItem = {
      key: Date.now(),
      item_id: null,
      quantity_issued: 0,
      unit_cost: 0,
      batch_number: ''
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
      title: 'Quantity Issued',
      dataIndex: 'quantity_issued',
      key: 'quantity_issued',
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantity_issued', val)}
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
      title: 'Issuance Number',
      dataIndex: 'issuance_number',
      key: 'issuance_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Issued Date',
      dataIndex: 'issued_date',
      key: 'issued_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Issued To',
      dataIndex: 'issued_to',
      key: 'issued_to',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Requisition',
      dataIndex: ['requisition', 'requisition_number'],
      key: 'requisition_number',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Location',
      dataIndex: ['location', 'location_name'],
      key: 'location_name',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Items Count',
      dataIndex: 'items',
      key: 'items_count',
      width: 100,
      align: 'center',
      render: (items) => <Tag color="blue">{items?.length || 0}</Tag>
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
      width: 150,
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
        </Space>
      )
    }
  ];

  return (
    <div className="issuance">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Stock Issuance</Title>
            <Text type="secondary">Issue stock items to departments and users</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              New Issuance
            </Button>
          </Space>
        </div>

        <Alert
          message="Issuance Process"
          description="Create issuance → Select items → Issue stock → Update balances"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Input
                placeholder="Search issuances..."
                allowClear
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="Filter by issued to"
                allowClear
                onChange={(e) => setFilters(prev => ({ ...prev, issued_to: e.target.value }))}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Filter by location"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => setFilters(prev => ({ ...prev, location_id: value }))}
              >
                {locations.map(location => (
                  <Option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* Issuances Table */}
        <Table
          columns={columns}
          dataSource={issuances}
          rowKey="issuance_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} issuances`
          }}
          onChange={setPagination}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title="New Issuance"
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
                name="issuance_number"
                label="Issuance Number"
                rules={[{ required: true, message: 'Please enter issuance number' }]}
              >
                <Input placeholder="Auto-generated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="issued_date"
                label="Issued Date"
                rules={[{ required: true, message: 'Please select issued date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="issued_by"
                label="Issued By"
                rules={[{ required: true, message: 'Please enter issuer name' }]}
              >
                <Input placeholder="Enter issuer name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="issued_to"
                label="Issued To"
                rules={[{ required: true, message: 'Please enter recipient' }]}
              >
                <Input placeholder="Enter recipient name/department" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requisition_id"
                label="Requisition (Optional)"
              >
                <Select placeholder="Select requisition" allowClear>
                  {requisitions.map(req => (
                    <Option key={req.requisition_id} value={req.requisition_id}>
                      {req.requisition_number} - {req.from_department}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Title level={4}>Issued Items</Title>
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
            scroll={{ x: 800 }}
            size="small"
          />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit"
                disabled={items.length === 0}
                icon={<SendOutlined />}
              >
                Create Issuance
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Issuance Details - ${selectedIssuance?.issuance_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedIssuance && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Issuance Number:</Text> {selectedIssuance.issuance_number}
              </Col>
              <Col span={12}>
                <Text strong>Issued Date:</Text> {dayjs(selectedIssuance.issued_date).format('DD/MM/YYYY')}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Issued To:</Text> {selectedIssuance.issued_to}
              </Col>
              <Col span={12}>
                <Text strong>Issued By:</Text> {selectedIssuance.issued_by}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Requisition:</Text> {selectedIssuance.requisition?.requisition_number || 'N/A'}
              </Col>
              <Col span={12}>
                <Text strong>Location:</Text> {selectedIssuance.location?.location_name}
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Remarks:</Text>
              <p>{selectedIssuance.remarks || 'No remarks'}</p>
            </div>

            <Divider />

            <Title level={5}>Issued Items</Title>
            <Table
              dataSource={selectedIssuance.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity', dataIndex: 'quantity_issued', key: 'quantity_issued', align: 'right' },
                { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', align: 'right' },
                { title: 'Total Cost', dataIndex: 'total_cost', key: 'total_cost', align: 'right' },
                { title: 'Batch', dataIndex: 'batch_number', key: 'batch_number' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .issuance {
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

export default Issuance;
