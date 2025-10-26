import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Tag,
  Typography,
  Statistic,
  Alert,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Ledger = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [stockBalances, setStockBalances] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [filters, setFilters] = useState({
    item_id: '',
    location_id: '',
    transaction_type: '',
    dateRange: null
  });

  const transactionTypes = [
    { value: 'receipt', label: 'Receipt', color: 'green' },
    { value: 'issue', label: 'Issue', color: 'red' },
    { value: 'adjustment', label: 'Adjustment', color: 'blue' },
    { value: 'transfer', label: 'Transfer', color: 'orange' }
  ];

  useEffect(() => {
    fetchInitialData();
    fetchLedgerEntries();
    fetchStockBalances();
    fetchLowStockItems();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [itemsRes, locationsRes] = await Promise.all([
        storesService.getItems({ status: 'active' }),
        storesService.getActiveLocations()
      ]);

      if (itemsRes.data.success) setItems(itemsRes.data.data.items);
      if (locationsRes.data.success) setLocations(locationsRes.data.data);
    } catch (error) {
      message.error('Failed to load initial data');
    }
  };

  const fetchLedgerEntries = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };

      if (filters.dateRange && filters.dateRange.length === 2) {
        params.start_date = filters.dateRange[0].format('YYYY-MM-DD');
        params.end_date = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await storesService.getStockLedger(params);

      if (response.data.success) {
        setLedgerEntries(response.data.data.ledgerEntries);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('Failed to fetch ledger entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockBalances = async () => {
    try {
      const response = await storesService.getStockBalances({
        item_id: filters.item_id,
        location_id: filters.location_id
      });

      if (response.data.success) {
        setStockBalances(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch stock balances');
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await storesService.getLowStockItems();

      if (response.data.success) {
        setLowStockItems(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch low stock items');
    }
  };

  const handleExport = () => {
    message.info('Export functionality will be implemented');
  };

  const ledgerColumns = [
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Item',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Location',
      dataIndex: ['location', 'location_name'],
      key: 'location_name',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      width: 120,
      render: (type) => {
        const config = transactionTypes.find(t => t.value === type);
        return <Tag color={config?.color}>{config?.label || type}</Tag>;
      }
    },
    {
      title: 'Reference',
      dataIndex: 'reference_type',
      key: 'reference_type',
      width: 120,
      render: (ref) => <Tag>{ref}</Tag>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (quantity) => (
        <Text style={{ color: quantity > 0 ? '#52c41a' : '#ff4d4f' }}>
          {quantity > 0 ? '+' : ''}{quantity}
        </Text>
      )
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      width: 100,
      align: 'right',
      render: (cost) => `UGX ${cost?.toLocaleString() || 0}`
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      width: 120,
      align: 'right',
      render: (cost) => `UGX ${cost?.toLocaleString() || 0}`
    },
    {
      title: 'Balance',
      dataIndex: 'balance_after',
      key: 'balance_after',
      width: 100,
      align: 'right',
      render: (balance) => <Text strong>{balance}</Text>
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      ellipsis: true
    }
  ];

  const balanceColumns = [
    {
      title: 'Item',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Location',
      dataIndex: ['location', 'location_name'],
      key: 'location_name',
      width: 150,
      ellipsis: true
    },
    {
      title: 'On Hand',
      dataIndex: 'quantity_on_hand',
      key: 'quantity_on_hand',
      width: 100,
      align: 'right',
      render: (qty) => <Text strong>{qty}</Text>
    },
    {
      title: 'Reserved',
      dataIndex: 'quantity_reserved',
      key: 'quantity_reserved',
      width: 100,
      align: 'right',
      render: (qty) => <Text type="warning">{qty}</Text>
    },
    {
      title: 'Available',
      dataIndex: 'quantity_available',
      key: 'quantity_available',
      width: 100,
      align: 'right',
      render: (qty) => (
        <Text style={{ color: qty > 10 ? '#52c41a' : qty > 0 ? '#fa8c16' : '#ff4d4f' }}>
          {qty}
        </Text>
      )
    },
    {
      title: 'Unit',
      dataIndex: ['item', 'unit_of_measure'],
      key: 'unit_of_measure',
      width: 80
    }
  ];

  const lowStockColumns = [
    {
      title: 'Item',
      dataIndex: ['item', 'item_name'],
      key: 'item_name',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Location',
      dataIndex: ['location', 'location_name'],
      key: 'location_name',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Available',
      dataIndex: 'quantity_available',
      key: 'quantity_available',
      width: 100,
      align: 'right',
      render: (qty) => <Text type="danger">{qty}</Text>
    },
    {
      title: 'Minimum Level',
      dataIndex: ['item', 'minimum_stock_level'],
      key: 'minimum_stock_level',
      width: 120,
      align: 'right',
      render: (level) => <Text>{level || 'Not set'}</Text>
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const available = record.quantity_available;
        const minimum = record.item?.minimum_stock_level || 0;
        
        if (available <= 0) return <Tag color="red">Out of Stock</Tag>;
        if (available <= minimum) return <Tag color="orange">Low Stock</Tag>;
        return <Tag color="green">Adequate</Tag>;
      }
    }
  ];

  return (
    <div className="ledger">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Stock Ledger</Title>
            <Text type="secondary">Track all stock movements and balances</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchLedgerEntries();
                fetchStockBalances();
                fetchLowStockItems();
              }}
            >
              Refresh
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Space>
        </div>

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Total Items" 
              value={stockBalances.length}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Low Stock Items" 
              value={lowStockItems.length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Out of Stock" 
              value={lowStockItems.filter(item => item.quantity_available <= 0).length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Total Value" 
              value={stockBalances.reduce((sum, item) => sum + (item.quantity_on_hand * (item.average_cost || 0)), 0)}
              prefix="UGX"
              precision={0}
            />
          </Col>
        </Row>

        <Tabs defaultActiveKey="ledger">
          <TabPane tab="Stock Ledger" key="ledger">
            {/* Filters */}
            <div className="filters-section">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Select
                    placeholder="Filter by item"
                    allowClear
                    style={{ width: '100%' }}
                    onChange={(value) => setFilters(prev => ({ ...prev, item_id: value }))}
                  >
                    {items.map(item => (
                      <Option key={item.item_id} value={item.item_id}>
                        {item.item_name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    placeholder="Filter by location"
                    allowClear
                    style={{ width: '100%' }}
                    onChange={(value) => setFilters(prev => ({ ...prev, location_id: value }))}
                  >
                    {locations.map(location => (
                      <Option key={location.location_id} value={location.location_id}>
                        {location.location_name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    placeholder="Filter by type"
                    allowClear
                    style={{ width: '100%' }}
                    onChange={(value) => setFilters(prev => ({ ...prev, transaction_type: value }))}
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
                    onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
                  />
                </Col>
              </Row>
            </div>

            {/* Ledger Table */}
            <Table
              columns={ledgerColumns}
              dataSource={ledgerEntries}
              rowKey="ledger_id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} entries`
              }}
              onChange={setPagination}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </TabPane>

          <TabPane tab="Stock Balance" key="balance">
            <Alert
              message="Current Stock Balances"
              description="Real-time stock levels across all locations"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={balanceColumns}
              dataSource={stockBalances}
              rowKey={(record) => `${record.item_id}-${record.location_id}`}
              pagination={{ pageSize: 20 }}
              scroll={{ x: 800 }}
              size="middle"
            />
          </TabPane>

          <TabPane tab="Low Stock Alert" key="lowstock">
            <Alert
              message="Low Stock Items"
              description="Items that need restocking or are out of stock"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={lowStockColumns}
              dataSource={lowStockItems}
              rowKey={(record) => `${record.item_id}-${record.location_id}`}
              pagination={{ pageSize: 20 }}
              scroll={{ x: 800 }}
              size="middle"
            />
          </TabPane>
        </Tabs>
      </Card>

      <style jsx>{`
        .ledger {
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

export default Ledger;
