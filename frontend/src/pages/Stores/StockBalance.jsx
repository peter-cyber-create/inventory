import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Select,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Alert,
  Progress,
  Typography,
  Badge,
  Dropdown,
  Menu
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { storesService } from '../../services/storesService';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const StockBalance = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    location_id: null,
    category_id: null,
    stock_status: ''
  });
  const [summary, setSummary] = useState({
    total_items: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_value: 0
  });

  const stockStatusConfig = {
    'IN_STOCK': { color: 'green', label: 'In Stock', icon: <CheckCircleOutlined /> },
    'LOW_STOCK': { color: 'orange', label: 'Low Stock', icon: <WarningOutlined /> },
    'OUT_OF_STOCK': { color: 'red', label: 'Out of Stock', icon: <ExclamationCircleOutlined /> },
    'OVERSTOCKED': { color: 'purple', label: 'Overstocked', icon: <CheckCircleOutlined /> }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStockBalance();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInitialData = async () => {
    try {
      const [locationsRes, categoriesRes] = await Promise.all([
        storesService.getLocations({ status: 'active' }),
        storesService.getCategories({ status: 'active' })
      ]);

      if (locationsRes.success) setLocations(locationsRes.data.locations);
      if (categoriesRes.success) setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Failed to load initial data');
    }
  };

  const fetchStockBalance = async () => {
    try {
      setLoading(true);
      const response = await storesService.getStockBalance({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });

      if (response.success) {
        setStockItems(response.data.stockItems);
        setSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stock balance');
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

  const getStockStatus = (currentStock, minLevel, maxLevel) => {
    if (currentStock === 0) return 'OUT_OF_STOCK';
    if (currentStock <= minLevel) return 'LOW_STOCK';
    if (maxLevel && currentStock > maxLevel) return 'OVERSTOCKED';
    return 'IN_STOCK';
  };

  const getStockPercentage = (currentStock, maxLevel) => {
    if (!maxLevel || maxLevel === 0) return 0;
    return Math.min((currentStock / maxLevel) * 100, 100);
  };

  const formatCurrency = (value) => {
    return `UGX ${value?.toLocaleString() || '0'}`;
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
      <Menu.Item key="lowstock" icon={<WarningOutlined />}>
        Low Stock Report
      </Menu.Item>
    </Menu>
  );

  const handleExport = (format) => {
    console.log(`Exporting in ${format} format`);
    // This would trigger an export API call
  };

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      width: 120,
      fixed: 'left',
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 250,
      fixed: 'left',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
      width: 120,
      ellipsis: true
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
      title: 'Current Stock',
      dataIndex: 'current_stock',
      key: 'current_stock',
      width: 120,
      align: 'right',
      render: (stock, record) => {
        const status = getStockStatus(stock, record.min_level, record.max_level);
        const config = stockStatusConfig[status];
        return (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', color: config.color === 'red' ? '#ff4d4f' : '#000' }}>
              {stock?.toLocaleString() || '0'}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.unit_of_measure}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Min Level',
      dataIndex: 'min_level',
      key: 'min_level',
      width: 100,
      align: 'right',
      render: (level) => level || 'N/A'
    },
    {
      title: 'Max Level',
      dataIndex: 'max_level',
      key: 'max_level',
      width: 100,
      align: 'right',
      render: (level) => level || 'N/A'
    },
    {
      title: 'Stock Level',
      key: 'stock_level',
      width: 150,
      render: (_, record) => {
        const percentage = getStockPercentage(record.current_stock, record.max_level);
        const status = getStockStatus(record.current_stock, record.min_level, record.max_level);
        const config = stockStatusConfig[status];
        
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              {config.icon}
              <span style={{ marginLeft: 4, fontSize: '12px' }}>{config.label}</span>
            </div>
            {record.max_level && (
              <Progress
                percent={percentage}
                size="small"
                status={status === 'LOW_STOCK' || status === 'OUT_OF_STOCK' ? 'exception' : 'normal'}
                strokeColor={
                  status === 'OUT_OF_STOCK' ? '#ff4d4f' :
                  status === 'LOW_STOCK' ? '#faad14' :
                  status === 'OVERSTOCKED' ? '#722ed1' : '#52c41a'
                }
              />
            )}
          </div>
        );
      }
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 120,
      align: 'right',
      render: (price) => price ? formatCurrency(price) : 'N/A'
    },
    {
      title: 'Total Value',
      key: 'total_value',
      width: 130,
      align: 'right',
      render: (_, record) => {
        const totalValue = (record.current_stock || 0) * (record.unit_price || 0);
        return (
          <span style={{ fontWeight: 'bold' }}>
            {formatCurrency(totalValue)}
          </span>
        );
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const status = getStockStatus(record.current_stock, record.min_level, record.max_level);
        const config = stockStatusConfig[status];
        return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>;
      }
    }
  ];

  return (
    <div className="stock-balance">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2} style={{ margin: 0 }}>Stock Balance</Title>
            <Text type="secondary">Current inventory levels and stock status overview</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchStockBalance}
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

        {/* Alert for low stock items */}
        {summary.low_stock > 0 && (
          <Alert
            message={`${summary.low_stock} items are running low on stock`}
            description="Please review and reorder these items to avoid stockouts"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
            action={
              <Button 
                size="small" 
                onClick={() => handleFilterChange('stock_status', 'LOW_STOCK')}
              >
                View Low Stock Items
              </Button>
            }
          />
        )}

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={5}>
            <Statistic 
              title="Total Items" 
              value={summary.total_items} 
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={5}>
            <Statistic 
              title="In Stock" 
              value={summary.in_stock} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic 
              title="Low Stock" 
              value={summary.low_stock} 
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Col>
          <Col span={5}>
            <Statistic 
              title="Out of Stock" 
              value={summary.out_of_stock} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Col>
          <Col span={5}>
            <Statistic 
              title="Total Value" 
              value={summary.total_value} 
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Search
                placeholder="Search items..."
                allowClear
                onSearch={(value) => handleFilterChange('search', value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="Select Location"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('location_id', value)}
                showSearch
                optionFilterProp="children"
              >
                {locations.map(location => (
                  <Option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={5}>
              <Select
                placeholder="Select Category"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('category_id', value)}
                showSearch
                optionFilterProp="children"
              >
                {categories.map(category => (
                  <Option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={5}>
              <Select
                placeholder="Stock Status"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('stock_status', value)}
              >
                {Object.entries(stockStatusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.icon} {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={3}>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => {
                  setFilters({
                    search: '',
                    location_id: null,
                    category_id: null,
                    stock_status: ''
                  });
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Stock Balance Table */}
        <Table
          columns={columns}
          dataSource={stockItems}
          rowKey={(record) => `${record.item_id}-${record.location_id}`}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} stock items`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          onChange={handleTableChange}
          scroll={{ x: 1600 }}
          size="small"
          bordered
          rowClassName={(record) => {
            const status = getStockStatus(record.current_stock, record.min_level, record.max_level);
            return status === 'OUT_OF_STOCK' ? 'out-of-stock-row' : 
                   status === 'LOW_STOCK' ? 'low-stock-row' : '';
          }}
        />
      </Card>

      <style jsx>{`
        .stock-balance {
          padding: 24px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .out-of-stock-row {
          background-color: #fff2f0;
        }

        .low-stock-row {
          background-color: #fffbe6;
        }
      `}</style>
    </div>
  );
};

export default StockBalance;
