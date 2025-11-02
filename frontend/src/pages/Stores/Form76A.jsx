import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  message,
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
  InputNumber,
  Tag,
  Tooltip,
  Divider,
  Typography,
  Steps,
  Alert
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  SaveOutlined,
  SendOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

const Form76A = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [form76aList, setForm76aList] = useState([]);
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
    'draft': { color: 'default', label: 'Draft' },
    'submitted': { color: 'blue', label: 'Submitted' },
    'printed': { color: 'green', label: 'Printed' }
  };

  const workflowSteps = [
    { title: 'Draft', description: 'Form being prepared' },
    { title: 'Submitted', description: 'Form submitted for processing' },
    { title: 'Printed', description: 'Form printed and ready for signatures' }
  ];

  useEffect(() => {
    fetchForm76AList();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchForm76AList = async () => {
    try {
      setLoading(true);
      const response = await storesService.getForm76AList({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.data.success) {
        setForm76aList(response.data.data.requisitions);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch Form 76A list');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedForm(null);
    setModalVisible(true);
    setItems([]);
    form.resetFields();
    form.setFieldsValue({
      formDate: dayjs(),
      status: 'draft'
    });
  };

  const handleView = async (record) => {
    try {
      const response = await storesService.getForm76A(record.requisition_id);
      if (response.data.success) {
        setSelectedForm(response.data.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to load Form 76A details');
    }
  };

  const handleEdit = async (record) => {
    try {
      const response = await storesService.getForm76A(record.requisition_id);
      if (response.data.success) {
        const formData = response.data.data;
        setSelectedForm(formData);
        setItems(formData.items || []);
        setModalVisible(true);
        
        form.setFieldsValue({
          formDate: dayjs(formData.form_date),
          fromDepartment: formData.from_department,
          toStore: formData.to_store,
          purposeRemarks: formData.purpose_remarks,
          status: formData.status
        });
      }
    } catch (error) {
      message.error('Failed to load Form 76A for editing');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (items.length === 0) {
        message.error('Please add at least one item to the form');
        return;
      }

      // Validate required fields
      if (!values.fromDepartment || !values.toStore || !values.purposeRemarks) {
        message.error('Please fill in all required fields');
        return;
      }

      // Get user context from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || user?.user_id || null;
      const departmentId = user?.department_id || null;

      const formData = {
        requisition_number: `REQ-${Date.now()}`,
        from_department: values.fromDepartment || '',
        to_department: values.toStore || '',
        purpose_remarks: values.purposeRemarks || '',
        requested_by: userId || values.requested_by || null,
        department_id: departmentId || values.department_id || null,
        status: values.status || 'draft',
        items: items.map(item => ({
          description: item.description || '',
          unit: item.unitOfIssue || '',
          qty_ordered: item.quantityOrdered || 0,
          qty_approved: item.quantityApproved || 0,
          qty_issued: item.quantityIssued || 0,
          qty_received: item.quantityReceived || 0
        }))
      };

      let response;
      if (selectedForm) {
        response = await storesService.updateForm76A(selectedForm.requisition_id, formData);
      } else {
        response = await storesService.createForm76A(formData);
      }

      if (response.data.success) {
        message.success(`Form 76A ${selectedForm ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        fetchForm76AList();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(`Failed to ${selectedForm ? 'update' : 'create'} Form 76A: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStatusUpdate = async (formId, status) => {
    try {
      const response = await storesService.updateForm76AStatus(formId, { status });
      if (response.data.success) {
        message.success(`Form 76A status updated to ${status}`);
        fetchForm76AList();
      }
    } catch (error) {
      message.error('Failed to update form status');
    }
  };

  const handleGeneratePDF = async (formId) => {
    try {
      const response = await storesService.generateForm76APDF(formId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Form76A-${formId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('PDF generated successfully');
    } catch (error) {
      message.error('Failed to generate PDF');
    }
  };

  const addItem = () => {
    const newItem = {
      key: Date.now(),
      serialNo: items.length + 1,
      description: '',
      unitOfIssue: '',
      quantityOrdered: 0,
      quantityApproved: 0,
      quantityIssued: 0,
      quantityReceived: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (key) => {
    const updatedItems = items.filter(item => item.key !== key);
    // Re-number serial numbers
    const renumberedItems = updatedItems.map((item, index) => ({
      ...item,
      serialNo: index + 1
    }));
    setItems(renumberedItems);
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

  const getWorkflowStep = (status) => {
    switch (status) {
      case 'draft': return 0;
      case 'submitted': return 1;
      case 'printed': return 2;
      default: return 0;
    }
  };

  const itemColumns = [
    {
      title: 'Serial No',
      dataIndex: 'serialNo',
      key: 'serialNo',
      width: 80,
      align: 'center',
      render: (value) => <Text strong>{value}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (value, record) => (
        <Input
          value={value}
          onChange={(e) => updateItem(record.key, 'description', e.target.value)}
          placeholder="Enter item description"
        />
      )
    },
    {
      title: 'Unit of Issue',
      dataIndex: 'unitOfIssue',
      key: 'unitOfIssue',
      width: 120,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateItem(record.key, 'unitOfIssue', val)}
          placeholder="Unit"
          style={{ width: '100%' }}
        >
          <Option value="Box">Box</Option>
          <Option value="Piece">Piece</Option>
          <Option value="Bottle">Bottle</Option>
          <Option value="Pack">Pack</Option>
          <Option value="Kg">Kg</Option>
          <Option value="Liter">Liter</Option>
          <Option value="Meter">Meter</Option>
          <Option value="Set">Set</Option>
        </Select>
      )
    },
    {
      title: 'Qty Ordered',
      dataIndex: 'quantityOrdered',
      key: 'quantityOrdered',
      width: 100,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantityOrdered', val)}
          style={{ width: '100%' }}
          min={1}
        />
      )
    },
    {
      title: 'Qty Approved',
      dataIndex: 'quantityApproved',
      key: 'quantityApproved',
      width: 100,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantityApproved', val)}
          style={{ width: '100%' }}
          min={0}
        />
      )
    },
    {
      title: 'Qty Issued',
      dataIndex: 'quantityIssued',
      key: 'quantityIssued',
      width: 100,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantityIssued', val)}
          style={{ width: '100%' }}
          min={0}
        />
      )
    },
    {
      title: 'Qty Received',
      dataIndex: 'quantityReceived',
      key: 'quantityReceived',
      width: 100,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateItem(record.key, 'quantityReceived', val)}
          style={{ width: '100%' }}
          min={0}
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
      title: 'Serial No',
      dataIndex: 'serial_no',
      key: 'serial_no',
      width: 150,
      render: (number, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          {number}
        </Button>
      )
    },
    {
      title: 'Date',
      dataIndex: 'form_date',
      key: 'form_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'From Department',
      dataIndex: 'from_department',
      key: 'from_department',
      width: 150,
      ellipsis: true
    },
    {
      title: 'To Store',
      dataIndex: 'to_store',
      key: 'to_store',
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
        const config = statusConfig[status] || statusConfig['draft'];
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
          
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {record.status === 'draft' && (
            <Tooltip title="Submit">
              <Button 
                type="text" 
                icon={<SendOutlined />}
                style={{ color: '#1890ff' }}
                onClick={() => handleStatusUpdate(record.requisition_id, 'submitted')}
              />
            </Tooltip>
          )}

          {record.status === 'submitted' && (
            <Tooltip title="Mark as Printed">
              <Button 
                type="text" 
                icon={<PrinterOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleStatusUpdate(record.requisition_id, 'printed')}
              />
            </Tooltip>
          )}

          <Tooltip title="Generate PDF">
            <Button 
              type="text" 
              icon={<DownloadOutlined />}
              onClick={() => handleGeneratePDF(record.requisition_id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="form76a">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Form 76A - Stores Requisition/Issue Voucher</Title>
            <Text type="secondary">Ministry of Health Official Requisition Form</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              New Form 76A
            </Button>
          </Space>
        </div>

        <Alert
          message="Form 76A Workflow"
          description="Draft → Submitted → Printed. Physical signatures are collected manually after printing."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Filters */}
        <div className="filters-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Input
                placeholder="Search by serial number, department, or store..."
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

        {/* Forms Table */}
        <Table
          columns={columns}
          dataSource={form76aList}
          rowKey="requisition_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} forms`
          }}
          onChange={setPagination}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={selectedForm ? 'Edit Form 76A' : 'New Form 76A'}
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
                name="formDate"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="fromDepartment"
                label="From Department/Unit"
                rules={[{ required: true, message: 'Please enter department' }]}
              >
                <Input placeholder="e.g., Pharmacy, Lab" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="toStore"
                label="To (Store/Receiving Section)"
                rules={[{ required: true, message: 'Please enter store' }]}
              >
                <Input placeholder="e.g., Main Store, Receiving" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="purposeRemarks"
            label="Purpose / Remarks"
            rules={[{ required: true, message: 'Please enter purpose' }]}
          >
            <TextArea rows={3} placeholder="Enter purpose or remarks for this requisition" />
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4}>Items Table</Title>
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
                icon={<SaveOutlined />}
              >
                {selectedForm ? 'Update Form' : 'Create Form'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Form 76A Details - ${selectedForm?.serial_no}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedForm && (
          <div>
            <Steps 
              current={getWorkflowStep(selectedForm.status)} 
              style={{ marginBottom: 24 }}
              size="small"
            >
              {workflowSteps.map((step, index) => (
                <Step key={index} title={step.title} description={step.description} />
              ))}
            </Steps>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Serial No:</Text> {selectedForm.serial_no}
              </Col>
              <Col span={12}>
                <Text strong>Date:</Text> {dayjs(selectedForm.form_date).format('DD/MM/YYYY')}
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>From Department:</Text> {selectedForm.from_department}
              </Col>
              <Col span={12}>
                <Text strong>To Store:</Text> {selectedForm.to_store}
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Purpose/Remarks:</Text>
              <p>{selectedForm.purpose_remarks}</p>
            </div>

            <Divider />

            <Title level={5}>Items</Title>
            <Table
              dataSource={selectedForm.items}
              pagination={false}
              size="small"
              columns={[
                { title: 'Serial No', dataIndex: 'serial_no', key: 'serial_no', width: 80, align: 'center' },
                { title: 'Description', dataIndex: 'description', key: 'description' },
                { title: 'Unit', dataIndex: 'unit_of_issue', key: 'unit_of_issue', width: 100 },
                { title: 'Qty Ordered', dataIndex: 'quantity_ordered', key: 'quantity_ordered', width: 100, align: 'right' },
                { title: 'Qty Approved', dataIndex: 'quantity_approved', key: 'quantity_approved', width: 100, align: 'right' },
                { title: 'Qty Issued', dataIndex: 'quantity_issued', key: 'quantity_issued', width: 100, align: 'right' },
                { title: 'Qty Received', dataIndex: 'quantity_received', key: 'quantity_received', width: 100, align: 'right' }
              ]}
            />

            <Divider />

            <Title level={5}>Signature Section</Title>
            <div style={{ marginTop: 16 }}>
              {selectedForm.signatures?.map((sig, index) => (
                <div key={index} style={{ marginBottom: 16, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <Text strong style={{ textTransform: 'capitalize' }}>
                    {sig.role.replace('_', ' ')}:
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>Name: ___________________________</Text>
                    <br />
                    <Text>Signature: _____________________</Text>
                    <br />
                    <Text>Date: ___________</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .form76a {
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

export default Form76A;

