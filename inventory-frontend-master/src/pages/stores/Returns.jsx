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
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  InputNumber,
  Alert,
  Divider,
  Typography,
  Upload,
  Radio
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ExportOutlined,
  UndoOutlined,
  FileImageOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [issuances, setIssuances] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    return_type: ''
  });

  const returnTypes = [
    { value: 'DAMAGED', label: 'Damaged', color: 'red' },
    { value: 'EXPIRED', label: 'Expired', color: 'orange' },
    { value: 'EXCESS', label: 'Excess/Unused', color: 'blue' },
    { value: 'WRONG_ITEM', label: 'Wrong Item', color: 'purple' },
    { value: 'DEFECTIVE', label: 'Defective', color: 'volcano' }
  ];

  const statusConfig = {
    'SUBMITTED': { color: 'blue', label: 'Submitted' },
    'APPROVED': { color: 'green', label: 'Approved' },
    'REJECTED': { color: 'red', label: 'Rejected' },
    'PROCESSED': { color: 'cyan', label: 'Processed' }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, locationsRes, issuancesRes] = await Promise.all([
        storesService.getItems({ status: 'active' }),
        storesService.getLocations({ status: 'active' }),
        storesService.getIssuances({ status: 'COMPLETED' })
      ]);

      if (itemsRes.success) setItems(itemsRes.data.items);
      if (locationsRes.success) setLocations(locationsRes.data.locations);
      if (issuancesRes.success) setIssuances(issuancesRes.data.issuances);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await storesService.getReturns({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.success) {
        setReturns(response.data.returns);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedReturn(null);
    setModalVisible(true);
    setReturnItems([]);
    form.resetFields();
    form.setFieldsValue({
      return_date: dayjs(),
      returned_by: 'Current User' // Should come from auth context
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getReturnDetails(record.return_id);
      if (response.success) {
        setSelectedReturn(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load return details');
    }
  };

  const handleApprove = async (returnId, action) => {
    try {
      const response = await storesService.updateReturnStatus(returnId, {
        action,
        remarks: '' // Could add remarks modal here
      });

      if (response.success) {
        message.success(`Return ${action} successfully`);
        fetchReturns();
      }
    } catch (error) {
      message.error(`Failed to ${action} return`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (returnItems.length === 0) {
        message.error('Please add at least one item to return');
        return;
      }

      const returnData = {
        ...values,
        return_date: values.return_date.format('YYYY-MM-DD'),
        items: returnItems.map(item => ({
          item_id: item.item_id,
          quantity_returned: item.quantity_returned,
          condition: item.condition,
          reason: item.reason,
          remarks: item.remarks
        }))
      };

      const response = await storesService.createReturn(returnData);
      
      if (response.success) {
        message.success('Return created successfully');
        setModalVisible(false);
        fetchReturns();
      }
    } catch (error) {
      message.error('Failed to create return');
    }
  };

  const addReturnItem = () => {
    const newItem = {
      key: Date.now(),
      item_id: null,
      item_name: '',
      quantity_returned: 0,
      condition: 'GOOD',
      reason: '',
      remarks: ''
    };
    setReturnItems([...returnItems, newItem]);
  };

  const removeReturnItem = (key) => {
    setReturnItems(returnItems.filter(item => item.key !== key));
  };

  const updateReturnItem = (key, field, value) => {
    const updated = returnItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // If item is selected, get item details
        if (field === 'item_id' && value) {
          const selectedItem = items.find(i => i.item_id === value);
          if (selectedItem) {
            updatedItem.item_name = selectedItem.item_name;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    setReturnItems(updated);
  };

  const returnItemColumns = [
    {
      title: 'Item',
      dataIndex: 'item_id',
      key: 'item_id',
      width: 200,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateReturnItem(record.key, 'item_id', val)}
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
      title: 'Quantity',
      dataIndex: 'quantity_returned',
      key: 'quantity_returned',
      width: 120,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateReturnItem(record.key, 'quantity_returned', val)}
          style={{ width: '100%' }}
          min={1}
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
          onChange={(val) => updateReturnItem(record.key, 'condition', val)}
          style={{ width: '100%' }}
        >
          <Option value="GOOD">Good</Option>
          <Option value="DAMAGED">Damaged</Option>
          <Option value="EXPIRED">Expired</Option>
          <Option value="DEFECTIVE">Defective</Option>
        </Select>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateReturnItem(record.key, 'reason', val)}
          placeholder="Select reason"
          style={{ width: '100%' }}
        >
          {returnTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: (value, record) => (
        <Input
          value={value}
          onChange={(e) => updateReturnItem(record.key, 'remarks', e.target.value)}
          placeholder="Enter remarks"
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
          onClick={() => removeReturnItem(record.key)}
        />
      )
    }
  ];

  const columns = [
    {
      title: 'Return No.',
      dataIndex: 'return_number',
      key: 'return_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Return Date',
      dataIndex: 'return_date',
      key: 'return_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Returned By',
      dataIndex: 'returned_by',
      key: 'returned_by',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Return Type',
      dataIndex: 'return_type',
      key: 'return_type',
      width: 120,
      render: (type) => {
        const config = returnTypes.find(t => t.value === type) || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Items Count',
      dataIndex: 'items_count',
      key: 'items_count',
      width: 100,
      align: 'center',
      render: (count) => <Tag color="blue">{count}</Tag>
    },
    {
      title: 'Total Quantity',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: 120,
      align: 'right'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = statusConfig[status] || statusConfig['SUBMITTED'];
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
          
          {record.status === 'SUBMITTED' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record.return_id, 'approve')}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />}
                  danger
                  onClick={() => handleApprove(record.return_id, 'reject')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="returns">
      <Card>
        <div className="page-header">
          <div>
            <h2>Returns</h2>
            <p>Manage stock returns and damaged item processing</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New Return
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Returns" 
              value={pagination.total} 
              prefix={<UndoOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Pending Approval" 
              value={returns.filter(r => r.status === 'SUBMITTED').length} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Approved" 
              value={returns.filter(r => r.status === 'APPROVED').length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Processed" 
              value={returns.filter(r => r.status === 'PROCESSED').length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search returns..."
                allowClear
                onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
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
            <Col span={6}>
              <Select
                placeholder="Filter by type"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => setFilters(prev => ({ ...prev, return_type: value }))}
              >
                {returnTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Returns Table */}
        <Table
          columns={columns}
          dataSource={returns}
          rowKey="return_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} returns`
          }}
          onChange={setPagination}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title="New Return"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Alert
            message="Return Process"
            description="Create a return request for items that need to be returned to inventory. All returns require approval before processing."
            type="info"
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="return_number"
                label="Return Number"
                rules={[{ required: true, message: 'Please enter return number' }]}
              >
                <Input placeholder="Auto-generated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="return_date"
                label="Return Date"
                rules={[{ required: true, message: 'Please select return date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="return_type"
                label="Return Type"
                rules={[{ required: true, message: 'Please select return type' }]}
              >
                <Select placeholder="Select return type">
                  {returnTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="returned_by"
                label="Returned By"
                rules={[{ required: true, message: 'Please enter returner name' }]}
              >
                <Input placeholder="Enter returner name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="original_issuance_id"
                label="Original Issuance (Optional)"
              >
                <Select
                  placeholder="Select original issuance"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {issuances.map(issuance => (
                    <Option key={issuance.issuance_id} value={issuance.issuance_id}>
                      {issuance.issue_number} - {issuance.requested_by}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reason"
            label="Return Reason"
            rules={[{ required: true, message: 'Please enter return reason' }]}
          >
            <TextArea rows={3} placeholder="Explain the reason for this return" />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Return Items</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addReturnItem}
            >
              Add Item
            </Button>
          </div>

          <Table
            columns={returnItemColumns}
            dataSource={returnItems}
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
                disabled={returnItems.length === 0}
              >
                Submit Return
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Return Details - ${selectedReturn?.return_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedReturn && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Returned By:</strong> {selectedReturn.returned_by}
              </Col>
              <Col span={12}>
                <strong>Return Date:</strong> {dayjs(selectedReturn.return_date).format('DD/MM/YYYY')}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Return Type:</strong> 
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  {selectedReturn.return_type}
                </Tag>
              </Col>
              <Col span={12}>
                <strong>Status:</strong>
                <Tag color={statusConfig[selectedReturn.status]?.color} style={{ marginLeft: 8 }}>
                  {statusConfig[selectedReturn.status]?.label}
                </Tag>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>Reason:</strong>
              <p>{selectedReturn.reason}</p>
            </div>

            <Divider />

            <h4>Returned Items</h4>
            <Table
              dataSource={selectedReturn.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity', dataIndex: 'quantity_returned', key: 'quantity_returned', align: 'right' },
                { title: 'Condition', dataIndex: 'condition', key: 'condition' },
                { title: 'Reason', dataIndex: 'reason', key: 'reason' },
                { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .returns {
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

export default Returns;
