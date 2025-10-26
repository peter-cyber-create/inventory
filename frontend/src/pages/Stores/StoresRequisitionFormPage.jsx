import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  DatePicker,
  Select,
  InputNumber,
  Space,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Modal,
  Alert
} from 'antd';
import {
  SaveOutlined,
  PrintOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StoresRequisitionFormPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [requisitionItems, setRequisitionItems] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [formData, setFormData] = useState({});

  // Initialize with 5 empty rows as specified
  useEffect(() => {
    const initialItems = Array.from({ length: 5 }, (_, index) => ({
      key: index + 1,
      itemNo: index + 1,
      description: '',
      unitOfIssue: '',
      quantityOrdered: 0,
      quantityApproved: 0,
      quantityIssued: 0
    }));
    setRequisitionItems(initialItems);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, departmentsRes] = await Promise.all([
        storesService.getItems({ status: 'active' }),
        // Assuming departments endpoint exists
        storesService.getItems({ status: 'active' }) // Placeholder
      ]);

      if (itemsRes.success) {
        setItems(itemsRes.data.items || []);
      }

      // Mock departments data - replace with actual API call
      setDepartments([
        'ICT Department',
        'Finance Department',
        'Human Resources',
        'Procurement Department',
        'Administration'
      ]);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      
      const requisitionData = {
        serialNo: values.serialNo || `REQ-${Date.now()}`,
        fromDept: values.fromDept,
        date: values.date.format('YYYY-MM-DD'),
        items: requisitionItems.filter(item => item.description.trim() !== ''),
        signatures: [] // Will be populated based on approval workflow
      };

      const response = await storesService.createRequisitionForm(requisitionData);
      
      if (response.success) {
        message.success('Requisition saved successfully');
        form.resetFields();
        setRequisitionItems(Array.from({ length: 5 }, (_, index) => ({
          key: index + 1,
          itemNo: index + 1,
          description: '',
          unitOfIssue: '',
          quantityOrdered: 0,
          quantityApproved: 0,
          quantityIssued: 0
        })));
      }
    } catch (error) {
      message.error('Failed to save requisition');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const values = form.getFieldsValue();
    setFormData(values);
    setPreviewVisible(true);
  };

  const updateRequisitionItem = (key, field, value) => {
    const updated = requisitionItems.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRequisitionItems(updated);
  };

  const addNewRow = () => {
    const newKey = Math.max(...requisitionItems.map(item => item.key)) + 1;
    const newItem = {
      key: newKey,
      itemNo: newKey,
      description: '',
      unitOfIssue: '',
      quantityOrdered: 0,
      quantityApproved: 0,
      quantityIssued: 0
    };
    setRequisitionItems([...requisitionItems, newItem]);
  };

  const removeRow = (key) => {
    if (requisitionItems.length > 1) {
      setRequisitionItems(requisitionItems.filter(item => item.key !== key));
    } else {
      message.warning('At least one row is required');
    }
  };

  const itemColumns = [
    {
      title: 'Item No.',
      dataIndex: 'itemNo',
      key: 'itemNo',
      width: 80,
      align: 'center',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Description of Item',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (value, record) => (
        <TextArea
          value={value}
          onChange={(e) => updateRequisitionItem(record.key, 'description', e.target.value)}
          placeholder="Enter item description"
          rows={2}
          style={{ width: '100%' }}
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
          onChange={(val) => updateRequisitionItem(record.key, 'unitOfIssue', val)}
          placeholder="Unit"
          style={{ width: '100%' }}
        >
          <Option value="PCS">PCS</Option>
          <Option value="KG">KG</Option>
          <Option value="LTR">LTR</Option>
          <Option value="BOX">BOX</Option>
          <Option value="SET">SET</Option>
          <Option value="PAIR">PAIR</Option>
          <Option value="MTR">MTR</Option>
          <Option value="SQM">SQM</Option>
        </Select>
      )
    },
    {
      title: 'Quantity Ordered',
      dataIndex: 'quantityOrdered',
      key: 'quantityOrdered',
      width: 120,
      align: 'center',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateRequisitionItem(record.key, 'quantityOrdered', val || 0)}
          min={0}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Quantity Approved',
      dataIndex: 'quantityApproved',
      key: 'quantityApproved',
      width: 120,
      align: 'center',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateRequisitionItem(record.key, 'quantityApproved', val || 0)}
          min={0}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Quantity Issued',
      dataIndex: 'quantityIssued',
      key: 'quantityIssued',
      width: 120,
      align: 'center',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateRequisitionItem(record.key, 'quantityIssued', val || 0)}
          min={0}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(record.key)}
          disabled={requisitionItems.length === 1}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            date: dayjs(),
            serialNo: `REQ-${Date.now()}`
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              THE REPUBLIC OF UGANDA
            </Title>
            <Title level={3} style={{ margin: '8px 0', color: '#1890ff' }}>
              MINISTRY OF HEALTH
            </Title>
            <Title level={4} style={{ margin: '16px 0', color: '#000' }}>
              STORES REQUISITION / ISSUE VOUCHER
            </Title>
          </div>

          <Divider style={{ borderColor: '#1890ff' }} />

          {/* Form Fields */}
          <Row gutter={24} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Form.Item
                name="fromDept"
                label="From Dept/Unit"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select Department" size="large">
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="serialNo"
                label="Serial No."
                rules={[{ required: true, message: 'Please enter serial number' }]}
              >
                <Input placeholder="Serial Number" size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  size="large"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Items Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px' 
            }}>
              <Title level={5} style={{ margin: 0 }}>
                ITEM DETAILS
              </Title>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={addNewRow}
              >
                Add Row
              </Button>
            </div>

            <Table
              columns={itemColumns}
              dataSource={requisitionItems}
              pagination={false}
              size="small"
              bordered
              style={{ marginBottom: '16px' }}
              scroll={{ x: 800 }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Space size="large">
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Save Requisition
              </Button>
              <Button 
                icon={<EyeOutlined />}
                onClick={handlePreview}
                size="large"
              >
                Preview
              </Button>
              <Button 
                icon={<PrintOutlined />}
                size="large"
              >
                Print
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Requisition Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
          <Button key="print" type="primary" icon={<PrintOutlined />}>
            Print
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            THE REPUBLIC OF UGANDA
          </Title>
          <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
            MINISTRY OF HEALTH
          </Title>
          <Title level={5} style={{ margin: '16px 0' }}>
            STORES REQUISITION / ISSUE VOUCHER
          </Title>
        </div>

        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Text strong>From Dept/Unit: </Text>
            <Text>{formData.fromDept}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Serial No.: </Text>
            <Text>{formData.serialNo}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Date: </Text>
            <Text>{formData.date?.format('DD/MM/YYYY')}</Text>
          </Col>
        </Row>

        <Table
          columns={[
            { title: 'Item No.', dataIndex: 'itemNo', key: 'itemNo', width: 80 },
            { title: 'Description of Item', dataIndex: 'description', key: 'description' },
            { title: 'Unit of Issue', dataIndex: 'unitOfIssue', key: 'unitOfIssue', width: 100 },
            { title: 'Qty Ordered', dataIndex: 'quantityOrdered', key: 'quantityOrdered', width: 100, align: 'center' },
            { title: 'Qty Approved', dataIndex: 'quantityApproved', key: 'quantityApproved', width: 100, align: 'center' },
            { title: 'Qty Issued', dataIndex: 'quantityIssued', key: 'quantityIssued', width: 100, align: 'center' }
          ]}
          dataSource={requisitionItems.filter(item => item.description.trim() !== '')}
          pagination={false}
          size="small"
          bordered
        />
      </Modal>
    </div>
  );
};

export default StoresRequisitionFormPage;
