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
  Radio,
  Upload
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ExportOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  UploadOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [adjustmentItems, setAdjustmentItems] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    adjustment_type: ''
  });

  const adjustmentTypes = [
    { value: 'STOCK_TAKE', label: 'Stock Take', color: 'blue' },
    { value: 'DAMAGE', label: 'Damage Write-off', color: 'red' },
    { value: 'LOSS', label: 'Loss/Theft', color: 'volcano' },
    { value: 'EXPIRED', label: 'Expired Items', color: 'orange' },
    { value: 'FOUND', label: 'Found Items', color: 'green' },
    { value: 'CORRECTION', label: 'System Correction', color: 'purple' }
  ];

  const statusConfig = {
    'DRAFT': { color: 'default', label: 'Draft' },
    'SUBMITTED': { color: 'blue', label: 'Submitted' },
    'APPROVED': { color: 'green', label: 'Approved' },
    'REJECTED': { color: 'red', label: 'Rejected' },
    'PROCESSED': { color: 'cyan', label: 'Processed' }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAdjustments();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, locationsRes] = await Promise.all([
        storesService.getItems({ status: 'active' }),
        storesService.getLocations({ status: 'active' })
      ]);

      if (itemsRes.success) setItems(itemsRes.data.items);
      if (locationsRes.success) setLocations(locationsRes.data.locations);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const response = await storesService.getAdjustments({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.success) {
        setAdjustments(response.data.adjustments);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch adjustments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAdjustment(null);
    setModalVisible(true);
    setAdjustmentItems([]);
    form.resetFields();
    form.setFieldsValue({
      adjustment_date: dayjs(),
      adjusted_by: 'Current User' // Should come from auth context
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getAdjustmentDetails(record.adjustment_id);
      if (response.success) {
        setSelectedAdjustment(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load adjustment details');
    }
  };

  const handleApprove = async (adjustmentId, action) => {
    try {
      const response = await storesService.updateAdjustmentStatus(adjustmentId, {
        action,
        remarks: '' // Could add remarks modal here
      });

      if (response.success) {
        message.success(`Adjustment ${action} successfully`);
        fetchAdjustments();
      }
    } catch (error) {
      message.error(`Failed to ${action} adjustment`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (adjustmentItems.length === 0) {
        message.error('Please add at least one item to adjust');
        return;
      }

      const adjustmentData = {
        ...values,
        adjustment_date: values.adjustment_date.format('YYYY-MM-DD'),
        items: adjustmentItems.map(item => ({
          item_id: item.item_id,
          location_id: item.location_id,
          system_quantity: item.system_quantity,
          actual_quantity: item.actual_quantity,
          variance: item.variance,
          remarks: item.remarks
        }))
      };

      const response = await storesService.createAdjustment(adjustmentData);
      
      if (response.success) {
        message.success('Adjustment created successfully');
        setModalVisible(false);
        fetchAdjustments();
      }
    } catch (error) {
      message.error('Failed to create adjustment');
    }
  };

  const addAdjustmentItem = () => {
    const newItem = {
      key: Date.now(),
      item_id: null,
      location_id: null,
      item_name: '',
      system_quantity: 0,
      actual_quantity: 0,
      variance: 0,
      remarks: ''
    };
    setAdjustmentItems([...adjustmentItems, newItem]);
  };

  const removeAdjustmentItem = (key) => {
    setAdjustmentItems(adjustmentItems.filter(item => item.key !== key));
  };

  const updateAdjustmentItem = async (key, field, value) => {
    const updated = adjustmentItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // If item or location is selected, fetch current stock
        if ((field === 'item_id' || field === 'location_id') && updatedItem.item_id && updatedItem.location_id) {
          // This would fetch current stock from the API
          // For now, we'll simulate it
          updatedItem.system_quantity = Math.floor(Math.random() * 100);
        }

        // Calculate variance when actual quantity changes
        if (field === 'actual_quantity') {
          updatedItem.variance = value - updatedItem.system_quantity;
        }

        // Get item name
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
    setAdjustmentItems(updated);
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return '#52c41a'; // Green for positive
    if (variance < 0) return '#ff4d4f'; // Red for negative
    return '#000'; // Black for zero
  };

  const adjustmentItemColumns = [
    {
      title: 'Item',
      dataIndex: 'item_id',
      key: 'item_id',
      width: 200,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateAdjustmentItem(record.key, 'item_id', val)}
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
      title: 'Location',
      dataIndex: 'location_id',
      key: 'location_id',
      width: 150,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateAdjustmentItem(record.key, 'location_id', val)}
          placeholder="Select location"
          style={{ width: '100%' }}
        >
          {locations.map(location => (
            <Option key={location.location_id} value={location.location_id}>
              {location.location_name}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'System Qty',
      dataIndex: 'system_quantity',
      key: 'system_quantity',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ fontWeight: 'bold' }}>{value || 0}</span>
      )
    },
    {
      title: 'Actual Qty',
      dataIndex: 'actual_quantity',
      key: 'actual_quantity',
      width: 120,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateAdjustmentItem(record.key, 'actual_quantity', val)}
          style={{ width: '100%' }}
          min={0}
        />
      )
    },
    {
      title: 'Variance',
      dataIndex: 'variance',
      key: 'variance',
      width: 100,
      align: 'right',
      render: (variance) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: getVarianceColor(variance)
        }}>
          {variance > 0 ? '+' : ''}{variance || 0}
        </span>
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
          onChange={(e) => updateAdjustmentItem(record.key, 'remarks', e.target.value)}
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
          onClick={() => removeAdjustmentItem(record.key)}
        />
      )
    }
  ];

  const columns = [
    {
      title: 'Adjustment No.',
      dataIndex: 'adjustment_number',
      key: 'adjustment_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Adjustment Date',
      dataIndex: 'adjustment_date',
      key: 'adjustment_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Type',
      dataIndex: 'adjustment_type',
      key: 'adjustment_type',
      width: 140,
      render: (type) => {
        const config = adjustmentTypes.find(t => t.value === type) || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Adjusted By',
      dataIndex: 'adjusted_by',
      key: 'adjusted_by',
      width: 150,
      ellipsis: true
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
      title: 'Total Variance',
      dataIndex: 'total_variance',
      key: 'total_variance',
      width: 120,
      align: 'right',
      render: (variance) => (
        <span style={{ 
          fontWeight: 'bold',
          color: getVarianceColor(variance)
        }}>
          {variance > 0 ? '+' : ''}{variance || 0}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = statusConfig[status] || statusConfig['DRAFT'];
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
                  onClick={() => handleApprove(record.adjustment_id, 'approve')}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />}
                  danger
                  onClick={() => handleApprove(record.adjustment_id, 'reject')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="adjustments">
      <Card>
        <div className="page-header">
          <div>
            <h2>Stock Adjustments</h2>
            <p>Manage inventory adjustments, stock takes, and corrections</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New Adjustment
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Adjustments" 
              value={pagination.total} 
              prefix={<ReloadOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Pending Approval" 
              value={adjustments.filter(a => a.status === 'SUBMITTED').length} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Approved" 
              value={adjustments.filter(a => a.status === 'APPROVED').length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="This Month" 
              value={adjustments.filter(a => 
                dayjs(a.adjustment_date).isSame(dayjs(), 'month')
              ).length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search adjustments..."
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
                onChange={(value) => setFilters(prev => ({ ...prev, adjustment_type: value }))}
              >
                {adjustmentTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Adjustments Table */}
        <Table
          columns={columns}
          dataSource={adjustments}
          rowKey="adjustment_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} adjustments`
          }}
          onChange={setPagination}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title="New Stock Adjustment"
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
          <Alert
            message="Stock Adjustment Process"
            description="Create stock adjustments to correct inventory discrepancies. All adjustments require approval before being processed."
            type="info"
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="adjustment_number"
                label="Adjustment Number"
                rules={[{ required: true, message: 'Please enter adjustment number' }]}
              >
                <Input placeholder="Auto-generated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="adjustment_date"
                label="Adjustment Date"
                rules={[{ required: true, message: 'Please select adjustment date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="adjustment_type"
                label="Adjustment Type"
                rules={[{ required: true, message: 'Please select adjustment type' }]}
              >
                <Select placeholder="Select adjustment type">
                  {adjustmentTypes.map(type => (
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
                name="adjusted_by"
                label="Adjusted By"
                rules={[{ required: true, message: 'Please enter adjuster name' }]}
              >
                <Input placeholder="Enter adjuster name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reference_document"
                label="Reference Document"
              >
                <Input placeholder="Enter reference document number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reason"
            label="Adjustment Reason"
            rules={[{ required: true, message: 'Please enter adjustment reason' }]}
          >
            <TextArea rows={3} placeholder="Explain the reason for this adjustment" />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Adjustment Items</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addAdjustmentItem}
            >
              Add Item
            </Button>
          </div>

          <Table
            columns={adjustmentItemColumns}
            dataSource={adjustmentItems}
            pagination={false}
            scroll={{ x: 1000 }}
            size="small"
            footer={() => {
              const totalVariance = adjustmentItems.reduce((sum, item) => sum + (item.variance || 0), 0);
              return (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total Variance: <span style={{ color: getVarianceColor(totalVariance) }}>
                    {totalVariance > 0 ? '+' : ''}{totalVariance}
                  </span>
                </div>
              );
            }}
          />

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit"
                disabled={adjustmentItems.length === 0}
              >
                Submit Adjustment
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Adjustment Details - ${selectedAdjustment?.adjustment_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={900}
        footer={null}
      >
        {selectedAdjustment && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Adjusted By:</strong> {selectedAdjustment.adjusted_by}
              </Col>
              <Col span={12}>
                <strong>Adjustment Date:</strong> {dayjs(selectedAdjustment.adjustment_date).format('DD/MM/YYYY')}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Type:</strong> 
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  {selectedAdjustment.adjustment_type}
                </Tag>
              </Col>
              <Col span={12}>
                <strong>Status:</strong>
                <Tag color={statusConfig[selectedAdjustment.status]?.color} style={{ marginLeft: 8 }}>
                  {statusConfig[selectedAdjustment.status]?.label}
                </Tag>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>Reason:</strong>
              <p>{selectedAdjustment.reason}</p>
            </div>

            <Divider />

            <h4>Adjustment Items</h4>
            <Table
              dataSource={selectedAdjustment.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Location', dataIndex: 'location_name', key: 'location_name' },
                { title: 'System Qty', dataIndex: 'system_quantity', key: 'system_quantity', align: 'right' },
                { title: 'Actual Qty', dataIndex: 'actual_quantity', key: 'actual_quantity', align: 'right' },
                { 
                  title: 'Variance', 
                  dataIndex: 'variance', 
                  key: 'variance', 
                  align: 'right',
                  render: (variance) => (
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: getVarianceColor(variance)
                    }}>
                      {variance > 0 ? '+' : ''}{variance}
                    </span>
                  )
                },
                { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .adjustments {
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

export default Adjustments;
