import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  message,
  Upload,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const GRN = () => {
  const [form] = Form.useForm();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGRN, setEditingGRN] = useState(null);
  const [items, setItems] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Load GRNs
  const loadGRNs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await storesService.getGRNs({
        page,
        limit: pagination.pageSize
      });
      setGrns(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: response.data.pagination.total
      }));
    } catch (error) {
      message.error('Failed to load GRNs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGRNs();
  }, []);

  // Add item row
  const addItem = () => {
    const newItem = {
      serial_no: items.length + 1,
      description: '',
      unit_of_measure: '',
      quantity_ordered: 0,
      quantity_delivered: 0,
      quantity_accepted: 0,
      unit_price: 0,
      remarks: ''
    };
    setItems([...items, newItem]);
  };

  // Remove item row
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    // Re-number serial numbers
    const renumberedItems = newItems.map((item, i) => ({
      ...item,
      serial_no: i + 1
    }));
    setItems(renumberedItems);
  };

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total value if unit_price and quantity_accepted are provided
    if (field === 'unit_price' || field === 'quantity_accepted') {
      const unitPrice = parseFloat(newItems[index].unit_price) || 0;
      const quantityAccepted = parseInt(newItems[index].quantity_accepted) || 0;
      newItems[index].total_value = unitPrice * quantityAccepted;
    }
    
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add GRN data
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      
      // Add items
      formData.append('items', JSON.stringify(items));
      
      // Add attachments
      attachments.forEach((file, index) => {
        formData.append('attachments', file.originFileObj);
        formData.append('document_types', JSON.stringify(['form5', 'technical_specs']));
      });

      if (editingGRN) {
        await storesService.updateGRN(editingGRN.grn_id, formData);
        message.success('GRN updated successfully');
      } else {
        await storesService.createGRN(formData);
        message.success('GRN created successfully');
      }

      setModalVisible(false);
      setEditingGRN(null);
      setItems([]);
      setAttachments([]);
      form.resetFields();
      loadGRNs();
    } catch (error) {
      message.error('Failed to save GRN');
    } finally {
      setLoading(false);
    }
  };

  // Edit GRN
  const editGRN = (grn) => {
    setEditingGRN(grn);
    form.setFieldsValue({
      date_received: dayjs(grn.date_received),
      delivery_note_no: grn.delivery_note_no,
      tax_invoice_no: grn.tax_invoice_no,
      lpo_no: grn.lpo_no,
      contract_no: grn.contract_no,
      supplier_name: grn.supplier_name,
      supplier_contact: grn.supplier_contact,
      delivery_location: grn.delivery_location,
      remarks: grn.remarks
    });
    setItems(grn.items || []);
    setModalVisible(true);
  };

  // Delete GRN
  const deleteGRN = async (id) => {
    try {
      await storesService.deleteGRN(id);
      message.success('GRN deleted successfully');
      loadGRNs();
    } catch (error) {
      message.error('Failed to delete GRN');
    }
  };

  // Generate PDF
  const generatePDF = async (id) => {
    try {
      const response = await storesService.generateGRNPDF(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GRN-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Failed to generate PDF');
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await storesService.updateGRNStatus(id, { status });
      message.success('Status updated successfully');
      loadGRNs();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'GRN No.',
      dataIndex: 'grn_number',
      key: 'grn_number',
    },
    {
      title: 'Date Received',
      dataIndex: 'date_received',
      key: 'date_received',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: 'LPO No.',
      dataIndex: 'lpo_no',
      key: 'lpo_no',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          draft: 'default',
          received: 'processing',
          inspected: 'warning',
          approved: 'success',
          rejected: 'error'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => editGRN(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editGRN(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => generatePDF(record.grn_id)}
          >
            PDF
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this GRN?"
            onConfirm={() => deleteGRN(record.grn_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Item table columns
  const itemColumns = [
    {
      title: 'Serial No.',
      dataIndex: 'serial_no',
      key: 'serial_no',
      width: 80,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateItem(index, 'description', e.target.value)}
          placeholder="Item description"
        />
      ),
    },
    {
      title: 'Unit of Measure',
      dataIndex: 'unit_of_measure',
      key: 'unit_of_measure',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateItem(index, 'unit_of_measure', e.target.value)}
          placeholder="Unit"
        />
      ),
    },
    {
      title: 'Qty Ordered',
      dataIndex: 'quantity_ordered',
      key: 'quantity_ordered',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      ),
    },
    {
      title: 'Qty Delivered',
      dataIndex: 'quantity_delivered',
      key: 'quantity_delivered',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => updateItem(index, 'quantity_delivered', parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      ),
    },
    {
      title: 'Qty Accepted',
      dataIndex: 'quantity_accepted',
      key: 'quantity_accepted',
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => updateItem(index, 'quantity_accepted', parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (text, record, index) => (
        <Input
          type="number"
          step="0.01"
          value={text}
          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
      ),
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (text) => text ? `$${text.toFixed(2)}` : '$0.00',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(index)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>Goods Received Notes (GRN)</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingGRN(null);
              setItems([]);
              setAttachments([]);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Create GRN
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={grns}
          loading={loading}
          rowKey="grn_id"
          pagination={{
            ...pagination,
            onChange: loadGRNs,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingGRN ? 'Edit GRN' : 'Create GRN'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            date_received: dayjs(),
          }}
        >
          <Title level={4}>GRN Details</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date_received"
                label="Date Received"
                rules={[{ required: true, message: 'Please select date received' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="delivery_note_no"
                label="Delivery Note No."
              >
                <Input placeholder="Delivery note number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tax_invoice_no"
                label="Tax Invoice No."
              >
                <Input placeholder="Tax invoice number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="lpo_no"
                label="LPO No."
              >
                <Input placeholder="Local Purchase Order number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contract_no"
                label="Contract No."
              >
                <Input placeholder="Procurement reference number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplier_name"
                label="Supplier Name"
                rules={[{ required: true, message: 'Please enter supplier name' }]}
              >
                <Input placeholder="Supplier name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supplier_contact"
                label="Supplier Contact"
              >
                <Input placeholder="Supplier contact information" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="delivery_location"
                label="Delivery Location"
                rules={[{ required: true, message: 'Please enter delivery location' }]}
              >
                <Input placeholder="Store section / delivery location" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="remarks"
            label="Remarks"
          >
            <TextArea rows={3} placeholder="Additional remarks" />
          </Form.Item>

          <Divider />

          <Title level={4}>Items</Title>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addItem}
              style={{ width: '100%' }}
            >
              Add Item
            </Button>
          </div>

          <Table
            columns={itemColumns}
            dataSource={items}
            pagination={false}
            size="small"
            rowKey={(record, index) => index}
          />

          <Divider />

          <Title level={4}>Supporting Documents</Title>
          <Upload
            multiple
            fileList={attachments}
            onChange={({ fileList }) => setAttachments(fileList)}
            beforeUpload={() => false}
            accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>Upload Documents</Button>
          </Upload>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingGRN ? 'Update' : 'Create'} GRN
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GRN;