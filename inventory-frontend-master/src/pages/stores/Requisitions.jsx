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
  Steps,
  Alert,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ExportOutlined,
  DeleteOutlined,
  SendOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const Requisitions = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [requisitionItems, setRequisitionItems] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: ''
  });

  const statusConfig = {
    'DRAFT': { color: 'default', label: 'Draft' },
    'SUBMITTED': { color: 'blue', label: 'Submitted' },
    'SUPERVISOR_APPROVED': { color: 'cyan', label: 'Supervisor Approved' },
    'FINANCE_APPROVED': { color: 'orange', label: 'Finance Approved' },
    'APPROVED': { color: 'green', label: 'Approved' },
    'REJECTED': { color: 'red', label: 'Rejected' },
    'PARTIALLY_ISSUED': { color: 'purple', label: 'Partially Issued' },
    'COMPLETED': { color: 'green', label: 'Completed' }
  };

  const approvalSteps = [
    { title: 'Submitted', description: 'Request submitted by user' },
    { title: 'Supervisor', description: 'Department supervisor approval' },
    { title: 'Finance', description: 'Finance department approval' },
    { title: 'Approved', description: 'Final approval for issuing' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchRequisitions();
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

  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      const response = await storesService.getRequisitions({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.success) {
        setRequisitions(response.data.requisitions);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch requisitions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRequisition(null);
    setModalVisible(true);
    setRequisitionItems([]);
    form.resetFields();
    form.setFieldsValue({
      request_date: dayjs(),
      requested_by: 'Current User' // Should come from auth context
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getRequisitionDetails(record.requisition_id);
      if (response.success) {
        setSelectedRequisition(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load requisition details');
    }
  };

  const handleApprove = async (requisitionId, action) => {
    try {
      const response = await storesService.updateRequisitionStatus(requisitionId, {
        action,
        remarks: '' // Could add remarks modal here
      });

      if (response.success) {
        message.success(`Requisition ${action} successfully`);
        fetchRequisitions();
      }
    } catch (error) {
      message.error(`Failed to ${action} requisition`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (requisitionItems.length === 0) {
        message.error('Please add at least one item to the requisition');
        return;
      }

      const requisitionData = {
        ...values,
        request_date: values.request_date.format('YYYY-MM-DD'),
        items: requisitionItems.map(item => ({
          item_id: item.item_id,
          quantity_requested: item.quantity_requested,
          remarks: item.remarks
        }))
      };

      const response = await storesService.createRequisition(requisitionData);
      
      if (response.success) {
        message.success('Requisition created successfully');
        setModalVisible(false);
        fetchRequisitions();
      }
    } catch (error) {
      message.error('Failed to create requisition');
    }
  };

  const addRequisitionItem = () => {
    const newItem = {
      key: Date.now(),
      item_id: null,
      item_name: '',
      quantity_requested: 0,
      available_stock: 0,
      remarks: ''
    };
    setRequisitionItems([...requisitionItems, newItem]);
  };

  const removeRequisitionItem = (key) => {
    setRequisitionItems(requisitionItems.filter(item => item.key !== key));
  };

  const updateRequisitionItem = async (key, field, value) => {
    const updated = requisitionItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // If item is selected, fetch available stock
        if (field === 'item_id' && value) {
          const selectedItem = items.find(i => i.item_id === value);
          if (selectedItem) {
            updatedItem.item_name = selectedItem.item_name;
            updatedItem.available_stock = selectedItem.current_stock || 0;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    setRequisitionItems(updated);
  };

  const getApprovalStep = (status) => {
    switch (status) {
      case 'DRAFT': return -1;
      case 'SUBMITTED': return 0;
      case 'SUPERVISOR_APPROVED': return 1;
      case 'FINANCE_APPROVED': return 2;
      case 'APPROVED': return 3;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  const requisitionItemColumns = [
    {
      title: 'Item',
      dataIndex: 'item_id',
      key: 'item_id',
      width: 250,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateRequisitionItem(record.key, 'item_id', val)}
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
      title: 'Available Stock',
      dataIndex: 'available_stock',
      key: 'available_stock',
      width: 120,
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock || 0}
        </Tag>
      )
    },
    {
      title: 'Quantity Requested',
      dataIndex: 'quantity_requested',
      key: 'quantity_requested',
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateRequisitionItem(record.key, 'quantity_requested', val)}
          style={{ width: '100%' }}
          min={1}
          max={record.available_stock}
        />
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      render: (value, record) => (
        <Input
          value={value}
          onChange={(e) => updateRequisitionItem(record.key, 'remarks', e.target.value)}
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
          onClick={() => removeRequisitionItem(record.key)}
        />
      )
    }
  ];

  const columns = [
    {
      title: 'Requisition No.',
      dataIndex: 'requisition_number',
      key: 'requisition_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Request Date',
      dataIndex: 'request_date',
      key: 'request_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Requested By',
      dataIndex: 'requested_by',
      key: 'requested_by',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
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
      width: 150,
      render: (status) => {
        const config = statusConfig[status] || statusConfig['DRAFT'];
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const colors = { 'HIGH': 'red', 'MEDIUM': 'orange', 'LOW': 'green' };
        return <Tag color={colors[priority]}>{priority}</Tag>;
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
                  icon={<CheckOutlined />}
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record.requisition_id, 'approve')}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseOutlined />}
                  danger
                  onClick={() => handleApprove(record.requisition_id, 'reject')}
                />
              </Tooltip>
            </>
          )}

          {record.status === 'APPROVED' && (
            <Tooltip title="Issue Items">
              <Button 
                type="text" 
                icon={<SendOutlined />}
                style={{ color: '#1890ff' }}
                onClick={() => {/* Navigate to issuance */}}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="requisitions">
      <Card>
        <div className="page-header">
          <div>
            <h2>Requisitions</h2>
            <p>Manage stock requisitions and approval workflow</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New Requisition
          </Button>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Requisitions" 
              value={pagination.total} 
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Pending Approval" 
              value={requisitions.filter(r => ['SUBMITTED', 'SUPERVISOR_APPROVED', 'FINANCE_APPROVED'].includes(r.status)).length} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Approved" 
              value={requisitions.filter(r => r.status === 'APPROVED').length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Completed" 
              value={requisitions.filter(r => r.status === 'COMPLETED').length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search requisitions..."
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
            <Col span={4}>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Col>
          </Row>
        </div>

        {/* Requisitions Table */}
        <Table
          columns={columns}
          dataSource={requisitions}
          rowKey="requisition_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} requisitions`
          }}
          onChange={setPagination}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title="New Requisition"
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
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="requisition_number"
                label="Requisition Number"
                rules={[{ required: true, message: 'Please enter requisition number' }]}
              >
                <Input placeholder="Auto-generated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="request_date"
                label="Request Date"
                rules={[{ required: true, message: 'Please select request date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="HIGH">High</Option>
                  <Option value="MEDIUM">Medium</Option>
                  <Option value="LOW">Low</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="requested_by"
                label="Requested By"
                rules={[{ required: true, message: 'Please enter requester name' }]}
              >
                <Input placeholder="Enter requester name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please enter department' }]}
              >
                <Input placeholder="Enter department" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="purpose"
            label="Purpose/Justification"
            rules={[{ required: true, message: 'Please enter purpose' }]}
          >
            <TextArea rows={3} placeholder="Enter purpose or justification for this requisition" />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Requisition Items</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addRequisitionItem}
            >
              Add Item
            </Button>
          </div>

          <Table
            columns={requisitionItemColumns}
            dataSource={requisitionItems}
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
                disabled={requisitionItems.length === 0}
              >
                Submit Requisition
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Requisition Details - ${selectedRequisition?.requisition_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedRequisition && (
          <div>
            <Steps 
              current={getApprovalStep(selectedRequisition.status)} 
              style={{ marginBottom: 24 }}
              size="small"
            >
              {approvalSteps.map((step, index) => (
                <Step key={index} title={step.title} description={step.description} />
              ))}
            </Steps>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Requested By:</strong> {selectedRequisition.requested_by}
              </Col>
              <Col span={12}>
                <strong>Department:</strong> {selectedRequisition.department}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Request Date:</strong> {dayjs(selectedRequisition.request_date).format('DD/MM/YYYY')}
              </Col>
              <Col span={12}>
                <strong>Priority:</strong> 
                <Tag color={selectedRequisition.priority === 'HIGH' ? 'red' : selectedRequisition.priority === 'MEDIUM' ? 'orange' : 'green'} style={{ marginLeft: 8 }}>
                  {selectedRequisition.priority}
                </Tag>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>Purpose:</strong>
              <p>{selectedRequisition.purpose}</p>
            </div>

            <Divider />

            <h4>Requested Items</h4>
            <Table
              dataSource={selectedRequisition.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity', dataIndex: 'quantity_requested', key: 'quantity_requested', align: 'right' },
                { title: 'Available Stock', dataIndex: 'available_stock', key: 'available_stock', align: 'right' },
                { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .requisitions {
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

export default Requisitions;
