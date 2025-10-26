import React, { useState, useEffect } from 'react';
import {
  Card,
  Steps,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Table,
  InputNumber,
  message,
  Divider,
  Alert,
  Space,
  Tag,
  Tooltip,
  Modal,
  Progress
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ReceivingGoods = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [consignmentForm] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [consignmentItems, setConsignmentItems] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [suppliersRes, locationsRes, itemsRes] = await Promise.all([
        storesService.getSuppliers({ status: 'active' }),
        storesService.getLocations({ status: 'active' }),
        storesService.getItems({ status: 'active' })
      ]);

      if (suppliersRes.success) setSuppliers(suppliersRes.data.suppliers);
      if (locationsRes.success) setLocations(locationsRes.data.locations);
      if (itemsRes.success) setItems(itemsRes.data.items);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const handleFileUpload = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls,.csv',
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                         file.type === 'application/vnd.ms-excel' ||
                         file.type === 'text/csv';
      
      if (!isValidType) {
        message.error('Please upload Excel or CSV files only');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB');
        return false;
      }

      return false; // Prevent automatic upload
    },
    onChange: async (info) => {
      if (info.file.status === 'uploading') {
        setProcessingFile(true);
        return;
      }

      if (info.file.originFileObj) {
        try {
          const formData = new FormData();
          formData.append('file', info.file.originFileObj);
          
          const response = await storesService.uploadForm5(formData);
          
          if (response.success) {
            setUploadedFiles([...uploadedFiles, {
              uid: info.file.uid,
              name: info.file.name,
              status: 'done',
              response: response.data
            }]);
            
            // Auto-populate consignment data
            if (response.data.consignmentData) {
              setConsignmentItems(response.data.consignmentData);
              message.success('Form5 processed successfully. Consignment data extracted.');
            }
          } else {
            message.error('Failed to process Form5 file');
          }
        } catch (error) {
          message.error('Error processing file');
        } finally {
          setProcessingFile(false);
        }
      }
    }
  };

  const handleConsignmentSubmit = async (values) => {
    try {
      setLoading(true);
      
      const consignmentData = {
        ...values,
        delivery_date: values.delivery_date?.format('YYYY-MM-DD'),
        items: consignmentItems
      };

      const response = await storesService.createConsignment(consignmentData);
      
      if (response.success) {
        message.success('Consignment created successfully');
        setCurrentStep(2);
      }
    } catch (error) {
      message.error('Failed to create consignment');
    } finally {
      setLoading(false);
    }
  };

  const handleGRNSubmit = async (values) => {
    try {
      setLoading(true);
      
      const grnData = {
        ...values,
        receipt_date: values.receipt_date?.format('YYYY-MM-DD'),
        consignment_id: consignmentForm.getFieldValue('consignment_id')
      };

      const response = await storesService.createGRN(grnData);
      
      if (response.success) {
        message.success('GRN created successfully');
        // Reset forms and go back to step 0
        form.resetFields();
        consignmentForm.resetFields();
        setConsignmentItems([]);
        setUploadedFiles([]);
        setCurrentStep(0);
      }
    } catch (error) {
      message.error('Failed to create GRN');
    } finally {
      setLoading(false);
    }
  };

  const addConsignmentItem = () => {
    const newItem = {
      key: Date.now(),
      item_name: '',
      description: '',
      quantity_expected: 0,
      unit_price: 0,
      total_value: 0
    };
    setConsignmentItems([...consignmentItems, newItem]);
  };

  const removeConsignmentItem = (key) => {
    setConsignmentItems(consignmentItems.filter(item => item.key !== key));
  };

  const updateConsignmentItem = (key, field, value) => {
    const updated = consignmentItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity_expected' || field === 'unit_price') {
          updatedItem.total_value = updatedItem.quantity_expected * updatedItem.unit_price;
        }
        return updatedItem;
      }
      return item;
    });
    setConsignmentItems(updated);
  };

  const consignmentColumns = [
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 200,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateConsignmentItem(record.key, 'item_name', e.target.value)}
          placeholder="Enter item name"
        />
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateConsignmentItem(record.key, 'description', e.target.value)}
          placeholder="Enter description"
        />
      )
    },
    {
      title: 'Quantity Expected',
      dataIndex: 'quantity_expected',
      key: 'quantity_expected',
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateConsignmentItem(record.key, 'quantity_expected', val)}
          style={{ width: '100%' }}
          min={0}
        />
      )
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 120,
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updateConsignmentItem(record.key, 'unit_price', val)}
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          formatter={value => `UGX ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/UGX\s?|(,*)/g, '')}
        />
      )
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      width: 120,
      render: (value) => (
        <span style={{ fontWeight: 'bold' }}>
          UGX {value?.toLocaleString() || '0'}
        </span>
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
          onClick={() => removeConsignmentItem(record.key)}
        />
      )
    }
  ];

  const steps = [
    {
      title: 'Upload Form5',
      content: (
        <Card title="Upload Form5 Document">
          <Alert
            message="Form5 Upload Instructions"
            description="Upload the official Form5 document (Excel/CSV format) to automatically extract consignment data. The system will parse item details, quantities, and pricing information."
            type="info"
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <Dragger {...handleFileUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag Form5 file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for Excel (.xlsx, .xls) and CSV files. File size limit: 10MB
            </p>
          </Dragger>

          {processingFile && (
            <div style={{ marginTop: 16 }}>
              <Progress percent={75} status="active" />
              <p>Processing Form5 file...</p>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Uploaded Files:</h4>
              {uploadedFiles.map(file => (
                <div key={file.uid} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <FileExcelOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <span>{file.name}</span>
                  <Tag color="green" style={{ marginLeft: 8 }}>Processed</Tag>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button 
              type="primary" 
              onClick={() => setCurrentStep(1)}
              disabled={uploadedFiles.length === 0}
            >
              Continue to Consignment Data
            </Button>
          </div>
        </Card>
      )
    },
    {
      title: 'Consignment Data',
      content: (
        <Card title="Consignment Information">
          <Form
            form={consignmentForm}
            layout="vertical"
            onFinish={handleConsignmentSubmit}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="consignment_number"
                  label="Consignment Number"
                  rules={[{ required: true, message: 'Please enter consignment number' }]}
                >
                  <Input placeholder="Enter consignment number" />
                </Form.Item>
              </Col>
              <Col span={8}>
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
              <Col span={8}>
                <Form.Item
                  name="delivery_date"
                  label="Expected Delivery Date"
                  rules={[{ required: true, message: 'Please select delivery date' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="invoice_number"
                  label="Invoice Number"
                >
                  <Input placeholder="Enter invoice number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="purchase_order_number"
                  label="Purchase Order Number"
                >
                  <Input placeholder="Enter PO number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="remarks"
              label="Remarks"
            >
              <TextArea rows={3} placeholder="Enter any remarks or special instructions" />
            </Form.Item>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Consignment Items</h3>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={addConsignmentItem}
              >
                Add Item
              </Button>
            </div>

            <Table
              columns={consignmentColumns}
              dataSource={consignmentItems}
              pagination={false}
              scroll={{ x: 800 }}
              size="small"
              footer={() => (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total Value: UGX {consignmentItems.reduce((sum, item) => sum + (item.total_value || 0), 0).toLocaleString()}
                </div>
              )}
            />

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>Back</Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                  disabled={consignmentItems.length === 0}
                >
                  Create Consignment
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      )
    },
    {
      title: 'Generate GRN',
      content: (
        <Card title="Goods Receipt Note (GRN)">
          <Alert
            message="Consignment Created Successfully"
            description="The consignment has been created. Now generate the GRN to complete the receiving process."
            type="success"
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleGRNSubmit}
            initialValues={{
              receipt_date: dayjs(),
              received_by: 'Current User' // This should come from auth context
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="grn_number"
                  label="GRN Number"
                  rules={[{ required: true, message: 'Please enter GRN number' }]}
                >
                  <Input placeholder="Enter GRN number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="receipt_date"
                  label="Receipt Date"
                  rules={[{ required: true, message: 'Please select receipt date' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="location_id"
                  label="Storage Location"
                  rules={[{ required: true, message: 'Please select storage location' }]}
                >
                  <Select placeholder="Select storage location">
                    {locations.map(location => (
                      <Option key={location.location_id} value={location.location_id}>
                        {location.location_name} ({location.location_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="received_by"
                  label="Received By"
                  rules={[{ required: true, message: 'Please enter receiver name' }]}
                >
                  <Input placeholder="Enter receiver name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="condition"
                  label="Condition"
                  rules={[{ required: true, message: 'Please select condition' }]}
                >
                  <Select placeholder="Select condition">
                    <Option value="good">Good</Option>
                    <Option value="damaged">Damaged</Option>
                    <Option value="partial">Partial</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="remarks"
              label="Receipt Remarks"
            >
              <TextArea rows={3} placeholder="Enter any remarks about the receipt" />
            </Form.Item>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCurrentStep(1)}>Back</Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Generate GRN
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div className="receiving-goods">
      <Card>
        <div className="page-header">
          <div>
            <h2>Receiving Goods</h2>
            <p>Process incoming goods with Form5 upload and GRN generation</p>
          </div>
        </div>

        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="steps-content">
          {steps[currentStep].content}
        </div>
      </Card>

      <style jsx>{`
        .receiving-goods {
          padding: 24px;
        }
        
        .page-header {
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
        
        .steps-content {
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default ReceivingGoods;
