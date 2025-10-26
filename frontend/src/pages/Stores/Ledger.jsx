import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Tag,
  Modal,
  message,
  Statistic,
  Divider
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Ledger = () => {
  const [form] = Form.useForm();
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [stockBalances, setStockBalances] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [filters, setFilters] = useState({});

  // Load ledger entries
  const loadLedgerEntries = async (page = 1, searchFilters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        ...searchFilters
      };

      const response = await storesService.getStockLedger(params);
      setLedgerEntries(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: response.data.pagination.total
      }));
    } catch (error) {
      message.error('Failed to load ledger entries');
    } finally {
      setLoading(false);
    }
  };

  // Load stock balances
  const loadStockBalances = async () => {
    try {
      const response = await storesService.getStockBalances();
      setStockBalances(response.data.data);
    } catch (error) {
      message.error('Failed to load stock balances');
    }
  };

  // Load low stock items
  const loadLowStockItems = async () => {
    try {
      const response = await storesService.getLowStockItems({ threshold: 10 });
      setLowStockItems(response.data.data);
    } catch (error) {
      message.error('Failed to load low stock items');
    }
  };

  useEffect(() => {
    loadLedgerEntries();
    loadStockBalances();
    loadLowStockItems();
  }, []);

  // Handle search
  const handleSearch = (values) => {
    const searchFilters = {};
    if (values.item_code) searchFilters.item_code = values.item_code;
    if (values.department) searchFilters.department = values.department;
    if (values.reference_type) searchFilters.reference_type = values.reference_type;
    if (values.date_range) {
      searchFilters.date_from = values.date_range[0].format('YYYY-MM-DD');
      searchFilters.date_to = values.date_range[1].format('YYYY-MM-DD');
    }
    
    setFilters(searchFilters);
    loadLedgerEntries(1, searchFilters);
  };

  // Reset search
  const handleReset = () => {
    form.resetFields();
    setFilters({});
    loadLedgerEntries();
  };

  // Create manual entry
  const handleManualEntry = async (values) => {
    setLoading(true);
    try {
      await storesService.createManualLedgerEntry(values);
      message.success('Manual entry created successfully');
      setModalVisible(false);
      form.resetFields();
      loadLedgerEntries();
      loadStockBalances();
    } catch (error) {
      message.error('Failed to create manual entry');
    } finally {
      setLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      const response = await storesService.exportLedgerPDF(filters);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'stores-ledger.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Failed to export PDF');
    }
  };

  // Export to Excel
  const exportToExcel = async () => {
    try {
      const response = await storesService.exportLedgerExcel(filters);
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'stores-ledger.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Failed to export Excel');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.transaction_date).unix() - dayjs(b.transaction_date).unix(),
    },
    {
      title: 'Ref Type',
      dataIndex: 'reference_type',
      key: 'reference_type',
      render: (type) => {
        const colors = {
          grn: 'green',
          requisition: 'blue',
          return: 'orange',
          adjustment: 'purple',
          transfer: 'cyan',
          disposal: 'red'
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Ref Number',
      dataIndex: 'reference_number',
      key: 'reference_number',
    },
    {
      title: 'Item Description',
      dataIndex: 'item_description',
      key: 'item_description',
    },
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
    },
    {
      title: 'Unit',
      dataIndex: 'unit_of_issue',
      key: 'unit_of_issue',
    },
    {
      title: 'Qty Received',
      dataIndex: 'quantity_received',
      key: 'quantity_received',
      render: (qty) => qty > 0 ? qty : '-',
    },
    {
      title: 'Qty Issued',
      dataIndex: 'quantity_issued',
      key: 'quantity_issued',
      render: (qty) => qty > 0 ? qty : '-',
    },
    {
      title: 'Balance',
      dataIndex: 'balance_on_hand',
      key: 'balance_on_hand',
      render: (balance) => (
        <Tag color={balance <= 10 ? 'red' : balance <= 50 ? 'orange' : 'green'}>
          {balance}
        </Tag>
      ),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      render: (cost) => cost ? `$${cost.toFixed(2)}` : '-',
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (value) => value ? `$${value.toFixed(2)}` : '-',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
  ];

  // Stock balances columns
  const balanceColumns = [
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
    },
    {
      title: 'Description',
      dataIndex: 'item_description',
      key: 'item_description',
    },
    {
      title: 'Unit',
      dataIndex: 'unit_of_issue',
      key: 'unit_of_issue',
    },
    {
      title: 'Balance',
      dataIndex: 'balance_on_hand',
      key: 'balance_on_hand',
      render: (balance) => (
        <Tag color={balance <= 10 ? 'red' : balance <= 50 ? 'orange' : 'green'}>
          {balance}
        </Tag>
      ),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      render: (cost) => cost ? `$${cost.toFixed(2)}` : '-',
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (value) => value ? `$${value.toFixed(2)}` : '-',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>Stores Ledger</Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Manual Entry
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={exportToPDF}
            >
              Export PDF
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
            >
              Export Excel
            </Button>
          </Space>
        </div>

        {/* Search Form */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="item_code">
              <Input placeholder="Item Code" />
            </Form.Item>
            <Form.Item name="department">
              <Input placeholder="Department" />
            </Form.Item>
            <Form.Item name="reference_type">
              <Select placeholder="Reference Type" style={{ width: 150 }}>
                <Option value="grn">GRN</Option>
                <Option value="requisition">Requisition</Option>
                <Option value="return">Return</Option>
                <Option value="adjustment">Adjustment</Option>
                <Option value="transfer">Transfer</Option>
                <Option value="disposal">Disposal</Option>
              </Select>
            </Form.Item>
            <Form.Item name="date_range">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button onClick={handleReset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Items"
                value={stockBalances.length}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Low Stock Items"
                value={lowStockItems.length}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={pagination.total}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={stockBalances.reduce((sum, item) => sum + (item.total_value || 0), 0)}
                prefix="$"
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* Ledger Table */}
        <Table
          columns={columns}
          dataSource={ledgerEntries}
          loading={loading}
          rowKey="ledger_id"
          pagination={{
            ...pagination,
            onChange: loadLedgerEntries,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Stock Balances */}
      <Card title="Current Stock Balances" style={{ marginTop: 16 }}>
        <Table
          columns={balanceColumns}
          dataSource={stockBalances}
          rowKey="item_code"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card title="Low Stock Items" style={{ marginTop: 16 }}>
          <Table
            columns={balanceColumns}
            dataSource={lowStockItems}
            rowKey="item_code"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      {/* Manual Entry Modal */}
      <Modal
        title="Create Manual Ledger Entry"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          onFinish={handleManualEntry}
          initialValues={{
            transaction_date: dayjs(),
            reference_type: 'adjustment',
            quantity_received: 0,
            quantity_issued: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="transaction_date"
                label="Transaction Date"
                rules={[{ required: true, message: 'Please select transaction date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reference_type"
                label="Reference Type"
                rules={[{ required: true, message: 'Please select reference type' }]}
              >
                <Select>
                  <Option value="adjustment">Adjustment</Option>
                  <Option value="transfer">Transfer</Option>
                  <Option value="disposal">Disposal</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reference_number"
                label="Reference Number"
                rules={[{ required: true, message: 'Please enter reference number' }]}
              >
                <Input placeholder="Reference number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="item_code"
                label="Item Code"
                rules={[{ required: true, message: 'Please enter item code' }]}
              >
                <Input placeholder="Item code" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="item_description"
            label="Item Description"
            rules={[{ required: true, message: 'Please enter item description' }]}
          >
            <Input placeholder="Item description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="unit_of_issue"
                label="Unit of Issue"
                rules={[{ required: true, message: 'Please enter unit of issue' }]}
              >
                <Input placeholder="Unit" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quantity_received"
                label="Quantity Received"
                rules={[{ required: true, message: 'Please enter quantity received' }]}
              >
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="quantity_issued"
                label="Quantity Issued"
                rules={[{ required: true, message: 'Please enter quantity issued' }]}
              >
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit_cost"
                label="Unit Cost"
              >
                <Input type="number" step="0.01" placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
              >
                <Input placeholder="Department" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="remarks"
            label="Remarks"
          >
            <Input.TextArea rows={3} placeholder="Additional remarks" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Entry
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Ledger;