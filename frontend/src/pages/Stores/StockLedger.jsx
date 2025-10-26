import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  Alert,
  Dropdown,
  Menu
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const StockLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    item_id: null,
    location_id: null,
    transaction_type: '',
    date_range: null
  });
  const [summary, setSummary] = useState({
    total_in: 0,
    total_out: 0,
    net_movement: 0,
    transaction_count: 0
  });

  const transactionTypes = [
    { value: 'GRN', label: 'Goods Receipt', color: 'green' },
    { value: 'ISSUE', label: 'Issue/Dispatch', color: 'orange' },
    { value: 'RETURN', label: 'Return', color: 'blue' },
    { value: 'ADJUSTMENT', label: 'Adjustment', color: 'purple' },
    { value: 'TRANSFER', label: 'Transfer', color: 'cyan' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTransactions();
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
      console.error('Failed to load initial data');
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      if (filters.date_range) {
        queryParams.start_date = filters.date_range[0].format('YYYY-MM-DD');
        queryParams.end_date = filters.date_range[1].format('YYYY-MM-DD');
      }

      const response = await storesService.getStockLedger(queryParams);

      if (response.success) {
        setTransactions(response.data.transactions);
        setSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (paginationData) => {
    setPagination(paginationData);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleExport = (format) => {
    // This would trigger an export API call
    console.log(`Exporting in ${format} format`);
  };

  const getTransactionTypeConfig = (type) => {
    return transactionTypes.find(t => t.value === type) || { label: type, color: 'default' };
  };

  const formatQuantity = (quantity, type) => {
    const sign = ['GRN', 'RETURN'].includes(type) ? '+' : '-';
    const color = ['GRN', 'RETURN'].includes(type) ? '#52c41a' : '#ff4d4f';
    
    return (
      <span style={{ color, fontWeight: 'bold' }}>
        {sign}{Math.abs(quantity)}
      </span>
    );
  };

  const exportMenu = (
    <Menu onClick={({ key }) => handleExport(key)}>
      <Menu.Item key="excel" icon={<ExportOutlined />}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="pdf" icon={<DownloadOutlined />}>
        Export to PDF
      </Menu.Item>
      <Menu.Item key="csv" icon={<ExportOutlined />}>
        Export to CSV
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: true
    },
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
      width: 130,
      render: (ref, record) => (
        <Tooltip title={`${record.transaction_type} Reference`}>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            {ref}
          </Button>
        </Tooltip>
      )
    },
    {
      title: 'Item',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 200,
      ellipsis: true,
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
      title: 'Transaction Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      width: 140,
      render: (type) => {
        const config = getTransactionTypeConfig(type);
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    {
      title: 'Location',
      dataIndex: 'location_name',
      key: 'location_name',
      width: 150,
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.location_code}
          </Text>
        </div>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (quantity, record) => formatQuantity(quantity, record.transaction_type)
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 120,
      align: 'right',
      render: (price) => price ? `UGX ${price.toLocaleString()}` : 'N/A'
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      width: 130,
      align: 'right',
      render: (value) => (
        <span style={{ fontWeight: 'bold' }}>
          UGX {value?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      title: 'Running Balance',
      dataIndex: 'running_balance',
      key: 'running_balance',
      width: 120,
      align: 'right',
      render: (balance) => (
        <span style={{ 
          fontWeight: 'bold',
          color: balance > 0 ? '#52c41a' : balance < 0 ? '#ff4d4f' : '#000'
        }}>
          {balance?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      ellipsis: true
    }
  ];

  return (
    <div className="stock-ledger">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2} style={{ margin: 0 }}>Stock Ledger</Title>
            <Text type="secondary">Complete transaction history and stock movements</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchTransactions}
            >
              Refresh
            </Button>
            <Dropdown overlay={exportMenu} placement="bottomRight">
              <Button icon={<ExportOutlined />}>
                Export
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Receipts" 
              value={summary.total_in} 
              valueStyle={{ color: '#52c41a' }}
              suffix="units"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Total Issues" 
              value={summary.total_out} 
              valueStyle={{ color: '#ff4d4f' }}
              suffix="units"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Net Movement" 
              value={summary.net_movement} 
              valueStyle={{ 
                color: summary.net_movement > 0 ? '#52c41a' : 
                       summary.net_movement < 0 ? '#ff4d4f' : '#000'
              }}
              suffix="units"
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Total Transactions" 
              value={summary.transaction_count} 
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Search
                placeholder="Search by reference or item..."
                allowClear
                onSearch={(value) => handleFilterChange('search', value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Select Item"
                allowClear
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
                onChange={(value) => handleFilterChange('item_id', value)}
              >
                {items.map(item => (
                  <Option key={item.item_id} value={item.item_id}>
                    {item.item_name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Select Location"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('location_id', value)}
              >
                {locations.map(location => (
                  <Option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Transaction Type"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('transaction_type', value)}
              >
                {transactionTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => handleFilterChange('date_range', dates)}
                format="DD/MM/YYYY"
              />
            </Col>
          </Row>
        </Card>

        {/* Alert for active filters */}
        {(filters.search || filters.item_id || filters.location_id || filters.transaction_type || filters.date_range) && (
          <Alert
            message="Filters Applied"
            description="One or more filters are currently active. Clear filters to see all transactions."
            type="info"
            showIcon
            closable
            onClose={() => {
              setFilters({
                search: '',
                item_id: null,
                location_id: null,
                transaction_type: '',
                date_range: null
              });
            }}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Transactions Table */}
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="ledger_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} transactions`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          size="small"
          bordered
        />
      </Card>

      <style jsx>{`
        .stock-ledger {
          padding: 24px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default StockLedger;
