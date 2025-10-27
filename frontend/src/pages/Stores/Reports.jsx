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
  Tabs,
  Spin
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    start_date: dayjs().subtract(30, 'days'),
    end_date: dayjs(),
    item_id: '',
    location_id: ''
  });

  useEffect(() => {
    fetchInitialData();
    fetchDashboardStats();
  }, []);

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

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await storesService.getDashboardStats();
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          dashboardStats: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockMovementReport = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: filters.start_date.format('YYYY-MM-DD'),
        end_date: filters.end_date.format('YYYY-MM-DD'),
        item_id: filters.item_id,
        location_id: filters.location_id
      };

      const response = await storesService.getStockMovementReport(params);
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          stockMovement: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch stock movement report');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockBalanceReport = async () => {
    try {
      setLoading(true);
      const params = {
        location_id: filters.location_id,
        low_stock_threshold: 10
      };

      const response = await storesService.getStockBalanceReport(params);
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          stockBalance: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch stock balance report');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsumptionReport = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: filters.start_date.format('YYYY-MM-DD'),
        end_date: filters.end_date.format('YYYY-MM-DD'),
        item_id: filters.item_id,
        location_id: filters.location_id
      };

      const response = await storesService.getConsumptionReport(params);
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          consumption: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch consumption report');
    } finally {
      setLoading(false);
    }
  };

  const fetchGRNSummaryReport = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: filters.start_date.format('YYYY-MM-DD'),
        end_date: filters.end_date.format('YYYY-MM-DD')
      };

      const response = await storesService.getGRNSummaryReport(params);
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          grnSummary: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch GRN summary report');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssuanceSummaryReport = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: filters.start_date.format('YYYY-MM-DD'),
        end_date: filters.end_date.format('YYYY-MM-DD'),
        location_id: filters.location_id
      };

      const response = await storesService.getIssuanceSummaryReport(params);
      if (response.data.success) {
        setReportData(prev => ({
          ...prev,
          issuanceSummary: response.data.data
        }));
      }
    } catch (error) {
      message.error('Failed to fetch issuance summary report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (reportType) => {
    message.info(`Export ${reportType} functionality will be implemented`);
  };

  const stockMovementColumns = [
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
        const colors = {
          'receipt': 'green',
          'issue': 'red',
          'adjustment': 'blue',
          'transfer': 'orange'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
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
    }
  ];

  const stockBalanceColumns = [
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
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const available = record.quantity_available;
        if (available <= 0) return <Tag color="red">Out of Stock</Tag>;
        if (available <= 10) return <Tag color="orange">Low Stock</Tag>;
        return <Tag color="green">Adequate</Tag>;
      }
    }
  ];

  const consumptionColumns = [
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
      title: 'Total Consumed',
      dataIndex: 'total_consumed',
      key: 'total_consumed',
      width: 120,
      align: 'right',
      render: (qty) => <Text strong>{qty}</Text>
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      width: 120,
      align: 'right',
      render: (value) => `UGX ${value?.toLocaleString() || 0}`
    },
    {
      title: 'Unit',
      dataIndex: ['item', 'unit_of_measure'],
      key: 'unit_of_measure',
      width: 80
    }
  ];

  const grnColumns = [
    {
      title: 'GRN Number',
      dataIndex: 'grn_number',
      key: 'grn_number',
      width: 150
    },
    {
      title: 'Received Date',
      dataIndex: 'received_date',
      key: 'received_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'supplier_name'],
      key: 'supplier_name',
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
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      align: 'right',
      render: (amount) => `UGX ${amount?.toLocaleString() || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colors = {
          'pending': 'orange',
          'approved': 'green',
          'rejected': 'red'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    }
  ];

  const issuanceColumns = [
    {
      title: 'Issuance Number',
      dataIndex: 'issuance_number',
      key: 'issuance_number',
      width: 150
    },
    {
      title: 'Issued Date',
      dataIndex: 'issued_date',
      key: 'issued_date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Issued To',
      dataIndex: 'issued_to',
      key: 'issued_to',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Requisition',
      dataIndex: ['requisition', 'requisition_number'],
      key: 'requisition_number',
      width: 150,
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const colors = {
          'pending': 'orange',
          'completed': 'green',
          'cancelled': 'red'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    }
  ];

  return (
    <div className="reports">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Stores Reports</Title>
            <Text type="secondary">Comprehensive reports and analytics for stores management</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchDashboardStats();
                fetchStockMovementReport();
                fetchStockBalanceReport();
                fetchConsumptionReport();
                fetchGRNSummaryReport();
                fetchIssuanceSummaryReport();
              }}
            >
              Refresh All
            </Button>
          </Space>
        </div>

        {/* Dashboard Statistics */}
        {reportData.dashboardStats && (
          <Card title="Dashboard Statistics" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic 
                  title="Total Items" 
                  value={reportData.dashboardStats.totalItems}
                  prefix={<BarChartOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Low Stock Items" 
                  value={reportData.dashboardStats.lowStockItems}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Total GRNs" 
                  value={reportData.dashboardStats.totalGRNs}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="Total Issuances" 
                  value={reportData.dashboardStats.totalIssuances}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Filters */}
        <Card title="Report Filters" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <RangePicker
                style={{ width: '100%' }}
                value={[filters.start_date, filters.end_date]}
                onChange={(dates) => setFilters(prev => ({ 
                  ...prev, 
                  start_date: dates?.[0] || dayjs().subtract(30, 'days'),
                  end_date: dates?.[1] || dayjs()
                }))}
              />
            </Col>
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
              <Button 
                type="primary" 
                onClick={() => {
                  fetchStockMovementReport();
                  fetchStockBalanceReport();
                  fetchConsumptionReport();
                  fetchGRNSummaryReport();
                  fetchIssuanceSummaryReport();
                }}
                loading={loading}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card>

        <Tabs defaultActiveKey="stock-movement">
          <TabPane tab="Stock Movement" key="stock-movement">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExport('Stock Movement')}
              >
                Export
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                columns={stockMovementColumns}
                dataSource={reportData.stockMovement || []}
                rowKey="ledger_id"
                pagination={{ pageSize: 20 }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Spin>
          </TabPane>

          <TabPane tab="Stock Balance" key="stock-balance">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExport('Stock Balance')}
              >
                Export
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                columns={stockBalanceColumns}
                dataSource={reportData.stockBalance || []}
                rowKey={(record) => `${record.item_id}-${record.location_id}`}
                pagination={{ pageSize: 20 }}
                scroll={{ x: 800 }}
                size="middle"
              />
            </Spin>
          </TabPane>

          <TabPane tab="Consumption" key="consumption">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExport('Consumption')}
              >
                Export
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                columns={consumptionColumns}
                dataSource={reportData.consumption || []}
                rowKey={(record) => `${record.item_id}-${record.location_id}`}
                pagination={{ pageSize: 20 }}
                scroll={{ x: 800 }}
                size="middle"
              />
            </Spin>
          </TabPane>

          <TabPane tab="GRN Summary" key="grn-summary">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExport('GRN Summary')}
              >
                Export
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                columns={grnColumns}
                dataSource={reportData.grnSummary || []}
                rowKey="grn_id"
                pagination={{ pageSize: 20 }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Spin>
          </TabPane>

          <TabPane tab="Issuance Summary" key="issuance-summary">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => handleExport('Issuance Summary')}
              >
                Export
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                columns={issuanceColumns}
                dataSource={reportData.issuanceSummary || []}
                rowKey="issuance_id"
                pagination={{ pageSize: 20 }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Spin>
          </TabPane>
        </Tabs>
      </Card>

      <style jsx>{`
        .reports {
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

export default Reports;

