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
  Descriptions
} from 'antd';
import {
  SendOutlined,
  EyeOutlined,
  CheckOutlined,
  SearchOutlined,
  ExportOutlined,
  PrinterOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const Issuances = () => {
  const [issuances, setIssuances] = useState([]);
  const [approvedRequisitions, setApprovedRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedIssuance, setSelectedIssuance] = useState(null);
  const [form] = Form.useForm();
  const [locations, setLocations] = useState([]);
  const [issueItems, setIssueItems] = useState([]);
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
    'PENDING': { color: 'orange', label: 'Pending' },
    'PARTIAL': { color: 'blue', label: 'Partially Issued' },
    'COMPLETED': { color: 'green', label: 'Completed' },
    'CANCELLED': { color: 'red', label: 'Cancelled' }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchIssuances();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [locationsRes, requisitionsRes] = await Promise.all([
        storesService.getLocations({ status: 'active' }),
        storesService.getRequisitions({ status: 'APPROVED' })
      ]);

      if (locationsRes.success) setLocations(locationsRes.data.locations);
      if (requisitionsRes.success) setApprovedRequisitions(requisitionsRes.data.requisitions);
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

      if (response.success) {
        setIssuances(response.data.issuances);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch issuances');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueFromRequisition = async (requisition) => {
    try {
      // Fetch requisition details with available stock
      const response = await storesService.getRequisitionDetails(requisition.requisition_id);
      if (response.success) {
        setSelectedRequisition(response.data);
        setIssueItems(response.data.items.map(item => ({
          ...item,
          quantity_to_issue: Math.min(item.quantity_requested, item.available_stock),
          issue_location_id: null
        })));
        setIssueModalVisible(true);
        form.setFieldsValue({
          issue_date: dayjs(),
          issued_by: 'Current User' // Should come from auth context
        });
      }
    } catch (error) {
      message.error('Failed to load requisition details');
    }
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getIssuanceDetails(record.issuance_id);
      if (response.success) {
        setSelectedIssuance(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load issuance details');
    }
  };

  const handleIssueSubmit = async (values) => {
    try {
      const totalQuantityToIssue = issueItems.reduce((sum, item) => sum + (item.quantity_to_issue || 0), 0);
      
      if (totalQuantityToIssue === 0) {
        message.error('Please specify quantities to issue');
        return;
      }

      const issueData = {
        ...values,
        issue_date: values.issue_date.format('YYYY-MM-DD'),
        requisition_id: selectedRequisition.requisition_id,
        items: issueItems.filter(item => item.quantity_to_issue > 0).map(item => ({
          item_id: item.item_id,
          quantity_issued: item.quantity_to_issue,
          location_id: item.issue_location_id,
          remarks: item.issue_remarks
        }))
      };

      const response = await storesService.createIssuance(issueData);
      
      if (response.success) {
        message.success('Issuance created successfully');
        setIssueModalVisible(false);
        fetchIssuances();
        fetchInitialData(); // Refresh approved requisitions
      }
    } catch (error) {
      message.error('Failed to create issuance');
    }
  };

  const updateIssueItem = (index, field, value) => {
    const updated = [...issueItems];
    updated[index] = { ...updated[index], [field]: value };
    setIssueItems(updated);
  };

  const calculateIssuanceStatus = (item) => {
    if (item.quantity_to_issue === 0) return 'Not Issued';
    if (item.quantity_to_issue < item.quantity_requested) return 'Partial';
    return 'Full';
  };

  const getIssuanceStatusColor = (status) => {
    switch (status) {
      case 'Full': return 'green';
      case 'Partial': return 'orange';
      case 'Not Issued': return 'red';
      default: return 'default';
    }
  };

  const issueItemColumns = [
    {
      title: 'Item',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 200,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.item_code}
          </Text>
        </div>
      )
    },
    {
      title: 'Requested',
      dataIndex: 'quantity_requested',
      key: 'quantity_requested',
      width: 100,
      align: 'center',
      render: (qty) => <Tag color="blue">{qty}</Tag>
    },
    {
      title: 'Available',
      dataIndex: 'available_stock',
      key: 'available_stock',
      width: 100,
      align: 'center',
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock || 0}
        </Tag>
      )
    },
    {
      title: 'Quantity to Issue',
      dataIndex: 'quantity_to_issue',
      key: 'quantity_to_issue',
      width: 150,
      render: (value, record, index) => (
        <InputNumber
          value={value}
          onChange={(val) => updateIssueItem(index, 'quantity_to_issue', val)}
          style={{ width: '100%' }}
          min={0}
          max={Math.min(record.quantity_requested, record.available_stock)}
        />
      )
    },
    {
      title: 'Issue From Location',
      dataIndex: 'issue_location_id',
      key: 'issue_location_id',
      width: 180,
      render: (value, record, index) => (
        <Select
          value={value}
          onChange={(val) => updateIssueItem(index, 'issue_location_id', val)}
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
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const status = calculateIssuanceStatus(record);
        return <Tag color={getIssuanceStatusColor(status)}>{status}</Tag>;
      }
    },
    {
      title: 'Remarks',
      dataIndex: 'issue_remarks',
      key: 'issue_remarks',
      width: 150,
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) => updateIssueItem(index, 'issue_remarks', e.target.value)}
          placeholder="Enter remarks"
          size="small"
        />
      )
    }
  ];

  const columns = [
    {
      title: 'Issue Number',
      dataIndex: 'issue_number',
      key: 'issue_number',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Requisition No.',
      dataIndex: 'requisition_number',
      key: 'requisition_number',
      width: 150
    },
    {
      title: 'Issue Date',
      dataIndex: 'issue_date',
      key: 'issue_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Issued To',
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
      dataIndex: 'total_quantity_issued',
      key: 'total_quantity_issued',
      width: 120,
      align: 'right'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = statusConfig[status] || statusConfig['PENDING'];
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Issued By',
      dataIndex: 'issued_by',
      key: 'issued_by',
      width: 120,
      ellipsis: true
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
          <Tooltip title="Print Issue Note">
            <Button 
              type="text" 
              icon={<PrinterOutlined />}
              onClick={() => {/* Handle print */}}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="issuances">
      <Card>
        <div className="page-header">
          <div>
            <h2>Issuances</h2>
            <p>Process approved requisitions and issue stock items</p>
          </div>
        </div>

        {/* Approved Requisitions Alert */}
        {approvedRequisitions.length > 0 && (
          <Alert
            message={`${approvedRequisitions.length} approved requisitions awaiting issuance`}
            description="Click on a requisition to process the issuance"
            type="info"
            showIcon
            action={
              <Space>
                {approvedRequisitions.slice(0, 3).map(req => (
                  <Button 
                    key={req.requisition_id}
                    size="small" 
                    type="primary"
                    onClick={() => handleIssueFromRequisition(req)}
                  >
                    Issue {req.requisition_number}
                  </Button>
                ))}
              </Space>
            }
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Issuances" 
              value={pagination.total} 
              prefix={<SendOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Pending" 
              value={issuances.filter(i => i.status === 'PENDING').length} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Partial Issues" 
              value={issuances.filter(i => i.status === 'PARTIAL').length} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Completed" 
              value={issuances.filter(i => i.status === 'COMPLETED').length} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Search
                placeholder="Search issuances..."
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
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Issue Modal */}
      <Modal
        title={`Issue Items - ${selectedRequisition?.requisition_number}`}
        open={issueModalVisible}
        onCancel={() => setIssueModalVisible(false)}
        width={1200}
        footer={null}
        destroyOnClose
      >
        {selectedRequisition && (
          <div>
            <Alert
              message="Stock Issuance"
              description="Review and adjust quantities before issuing. Items with insufficient stock will be highlighted."
              type="info"
              style={{ marginBottom: 16 }}
            />

            <Descriptions bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Requested By">{selectedRequisition.requested_by}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedRequisition.department}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedRequisition.priority === 'HIGH' ? 'red' : selectedRequisition.priority === 'MEDIUM' ? 'orange' : 'green'}>
                  {selectedRequisition.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Purpose" span={3}>
                {selectedRequisition.purpose}
              </Descriptions.Item>
            </Descriptions>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleIssueSubmit}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="issue_number"
                    label="Issue Number"
                    rules={[{ required: true, message: 'Please enter issue number' }]}
                  >
                    <Input placeholder="Auto-generated" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="issue_date"
                    label="Issue Date"
                    rules={[{ required: true, message: 'Please select issue date' }]}
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

              <Form.Item
                name="remarks"
                label="Issuance Remarks"
              >
                <TextArea rows={2} placeholder="Enter any remarks about this issuance" />
              </Form.Item>

              <Divider />

              <h4>Items to Issue</h4>
              <Table
                columns={issueItemColumns}
                dataSource={issueItems}
                pagination={false}
                scroll={{ x: 1000 }}
                size="small"
                rowClassName={(record) => 
                  record.available_stock < record.quantity_requested ? 'insufficient-stock' : ''
                }
              />

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setIssueModalVisible(false)}>Cancel</Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SendOutlined />}
                  >
                    Process Issuance
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Issuance Details - ${selectedIssuance?.issue_number}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={[
          <Button key="print" icon={<PrinterOutlined />}>
            Print Issue Note
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedIssuance && (
          <div>
            <Descriptions bordered>
              <Descriptions.Item label="Issue Number">{selectedIssuance.issue_number}</Descriptions.Item>
              <Descriptions.Item label="Issue Date">{dayjs(selectedIssuance.issue_date).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusConfig[selectedIssuance.status]?.color}>
                  {statusConfig[selectedIssuance.status]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Issued To">{selectedIssuance.requested_by}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedIssuance.department}</Descriptions.Item>
              <Descriptions.Item label="Issued By">{selectedIssuance.issued_by}</Descriptions.Item>
              <Descriptions.Item label="Remarks" span={3}>
                {selectedIssuance.remarks || 'No remarks'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h4>Issued Items</h4>
            <Table
              dataSource={selectedIssuance.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity Issued', dataIndex: 'quantity_issued', key: 'quantity_issued', align: 'right' },
                { title: 'Location', dataIndex: 'location_name', key: 'location_name' },
                { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' }
              ]}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .issuances {
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

        .insufficient-stock {
          background-color: #fff2f0;
        }
      `}</style>
    </div>
  );
};

export default Issuances;
