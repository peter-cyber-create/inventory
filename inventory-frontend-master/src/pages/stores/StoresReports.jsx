import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Form,
  Table,
  Statistic,
  Progress,
  Typography,
  Space,
  Divider,
  Alert,
  Tabs,
  Tag,
  Chart,
  Empty
} from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { storesService } from '../../services/storesService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StoresReports = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState({});
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    date_range: [dayjs().subtract(30, 'days'), dayjs()],
    location_id: null,
    category_id: null
  });

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [activeTab, filters]);

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

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const queryParams = {
        ...filters,
        start_date: filters.date_range[0].format('YYYY-MM-DD'),
        end_date: filters.date_range[1].format('YYYY-MM-DD')
      };

      const response = await storesService.getReports(activeTab, queryParams);
      
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (values) => {
    setFilters(values);
  };

  const handleExport = (format, reportType) => {
    console.log(`Exporting ${reportType} report in ${format} format`);
    // This would trigger an export API call
  };

  const formatCurrency = (value) => {
    return `UGX ${value?.toLocaleString() || '0'}`;
  };

  // Overview Report Component
  const OverviewReport = () => (
    <div>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Items"
              value={reportData.summary?.total_items || 0}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Receipts"
              value={reportData.summary?.total_receipts || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Issues"
              value={reportData.summary?.total_issues || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Value"
              value={reportData.summary?.total_value || 0}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
      </Row>

      {/* Stock Status Overview */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Stock Status Distribution" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="In Stock"
                  value={reportData.stockStatus?.in_stock || 0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Low Stock"
                  value={reportData.stockStatus?.low_stock || 0}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Out of Stock"
                  value={reportData.stockStatus?.out_of_stock || 0}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Overstocked"
                  value={reportData.stockStatus?.overstocked || 0}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Locations by Value" size="small">
            <Table
              dataSource={reportData.topLocations || []}
              columns={[
                { title: 'Location', dataIndex: 'location_name', key: 'location_name' },
                { 
                  title: 'Value', 
                  dataIndex: 'total_value', 
                  key: 'total_value',
                  render: (value) => formatCurrency(value)
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Recent Activities" size="small">
        <Table
          dataSource={reportData.recentActivities || []}
          columns={[
            { title: 'Date', dataIndex: 'date', key: 'date', width: 100 },
            { title: 'Type', dataIndex: 'type', key: 'type', width: 100,
              render: (type) => <Tag color="blue">{type}</Tag>
            },
            { title: 'Reference', dataIndex: 'reference', key: 'reference', width: 120 },
            { title: 'Item', dataIndex: 'item_name', key: 'item_name' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'right', width: 100 },
            { title: 'User', dataIndex: 'user_name', key: 'user_name', width: 120 }
          ]}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    </div>
  );

  // Stock Movement Report
  const StockMovementReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Total Receipts"
              value={reportData.movements?.total_receipts || 0}
              suffix="units"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Total Issues"
              value={reportData.movements?.total_issues || 0}
              suffix="units"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Net Movement"
              value={reportData.movements?.net_movement || 0}
              suffix="units"
              valueStyle={{ 
                color: (reportData.movements?.net_movement || 0) >= 0 ? '#52c41a' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Stock Movement Details" size="small">
        <Table
          dataSource={reportData.movementDetails || []}
          columns={[
            { title: 'Date', dataIndex: 'date', key: 'date', width: 100 },
            { title: 'Item', dataIndex: 'item_name', key: 'item_name' },
            { title: 'Type', dataIndex: 'transaction_type', key: 'transaction_type', width: 120,
              render: (type) => <Tag color={type === 'GRN' ? 'green' : 'orange'}>{type}</Tag>
            },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'right', width: 100 },
            { title: 'Location', dataIndex: 'location_name', key: 'location_name', width: 150 },
            { title: 'Reference', dataIndex: 'reference', key: 'reference', width: 120 }
          ]}
          pagination={{ pageSize: 20 }}
          size="small"
        />
      </Card>
    </div>
  );

  // Valuation Report
  const ValuationReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Inventory Value"
              value={reportData.valuation?.total_value || 0}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Average Item Value"
              value={reportData.valuation?.average_value || 0}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Most Valuable Item"
              value={reportData.valuation?.highest_value || 0}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Categories"
              value={reportData.valuation?.categories_count || 0}
              suffix="categories"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Items by Value" size="small">
            <Table
              dataSource={reportData.topValueItems || []}
              columns={[
                { title: 'Item', dataIndex: 'item_name', key: 'item_name' },
                { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'right' },
                { 
                  title: 'Unit Price', 
                  dataIndex: 'unit_price', 
                  key: 'unit_price',
                  render: (value) => formatCurrency(value)
                },
                { 
                  title: 'Total Value', 
                  dataIndex: 'total_value', 
                  key: 'total_value',
                  render: (value) => formatCurrency(value)
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Value by Category" size="small">
            <Table
              dataSource={reportData.categoryValues || []}
              columns={[
                { title: 'Category', dataIndex: 'category_name', key: 'category_name' },
                { title: 'Items', dataIndex: 'item_count', key: 'item_count', align: 'right' },
                { 
                  title: 'Total Value', 
                  dataIndex: 'total_value', 
                  key: 'total_value',
                  render: (value) => formatCurrency(value)
                },
                { 
                  title: 'Percentage', 
                  dataIndex: 'percentage', 
                  key: 'percentage',
                  render: (value) => `${value?.toFixed(1) || 0}%`
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Low Stock Report
  const LowStockReport = () => (
    <div>
      <Alert
        message={`${reportData.lowStockItems?.length || 0} items are below minimum stock level`}
        description="These items require immediate attention to prevent stockouts"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card title="Low Stock Items" size="small">
        <Table
          dataSource={reportData.lowStockItems || []}
          columns={[
            { title: 'Item Code', dataIndex: 'item_code', key: 'item_code', width: 120 },
            { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
            { title: 'Current Stock', dataIndex: 'current_stock', key: 'current_stock', align: 'right', width: 120 },
            { title: 'Min Level', dataIndex: 'min_level', key: 'min_level', align: 'right', width: 100 },
            { 
              title: 'Stock Level', 
              key: 'stock_level', 
              width: 150,
              render: (_, record) => {
                const percentage = (record.current_stock / record.min_level) * 100;
                return (
                  <Progress 
                    percent={Math.min(percentage, 100)} 
                    status={percentage < 50 ? 'exception' : 'normal'}
                    size="small"
                  />
                );
              }
            },
            { title: 'Location', dataIndex: 'location_name', key: 'location_name', width: 150 },
            { 
              title: 'Days Since Last Receipt', 
              dataIndex: 'days_since_receipt', 
              key: 'days_since_receipt', 
              align: 'right',
              width: 180
            }
          ]}
          pagination={{ pageSize: 20 }}
          size="small"
          rowClassName={(record) => 
            record.current_stock === 0 ? 'out-of-stock-row' : 'low-stock-row'
          }
        />
      </Card>
    </div>
  );

  // ABC Analysis Report
  const ABCAnalysisReport = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Category A Items"
              value={reportData.abcAnalysis?.categoryA?.count || 0}
              suffix={`(${reportData.abcAnalysis?.categoryA?.percentage || 0}%)`}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">High value items</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Category B Items"
              value={reportData.abcAnalysis?.categoryB?.count || 0}
              suffix={`(${reportData.abcAnalysis?.categoryB?.percentage || 0}%)`}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Medium value items</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Category C Items"
              value={reportData.abcAnalysis?.categoryC?.count || 0}
              suffix={`(${reportData.abcAnalysis?.categoryC?.percentage || 0}%)`}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Low value items</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="ABC Classification Details" size="small">
        <Table
          dataSource={reportData.abcItems || []}
          columns={[
            { title: 'Item Code', dataIndex: 'item_code', key: 'item_code', width: 120 },
            { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
            { 
              title: 'ABC Category', 
              dataIndex: 'abc_category', 
              key: 'abc_category', 
              width: 120,
              render: (category) => {
                const colors = { 'A': 'red', 'B': 'orange', 'C': 'green' };
                return <Tag color={colors[category]}>{category}</Tag>;
              }
            },
            { 
              title: 'Annual Usage Value', 
              dataIndex: 'annual_value', 
              key: 'annual_value',
              render: (value) => formatCurrency(value),
              align: 'right',
              width: 180
            },
            { 
              title: 'Cumulative %', 
              dataIndex: 'cumulative_percentage', 
              key: 'cumulative_percentage',
              render: (value) => `${value?.toFixed(1) || 0}%`,
              align: 'right',
              width: 120
            }
          ]}
          pagination={{ pageSize: 20 }}
          size="small"
        />
      </Card>
    </div>
  );

  return (
    <div className="stores-reports">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2} style={{ margin: 0 }}>Stores Reports</Title>
            <Text type="secondary">Comprehensive inventory analysis and reporting</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchReportData}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              icon={<FileExcelOutlined />}
              onClick={() => handleExport('excel', activeTab)}
            >
              Export Excel
            </Button>
            <Button 
              icon={<FilePdfOutlined />}
              onClick={() => handleExport('pdf', activeTab)}
            >
              Export PDF
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleFilterChange}
            initialValues={filters}
          >
            <Form.Item name="date_range" label="Date Range">
              <RangePicker />
            </Form.Item>
            <Form.Item name="location_id" label="Location">
              <Select placeholder="All Locations" allowClear style={{ width: 150 }}>
                {locations.map(location => (
                  <Option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="category_id" label="Category">
              <Select placeholder="All Categories" allowClear style={{ width: 150 }}>
                {categories.map(category => (
                  <Option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                Apply Filters
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Report Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          loading={loading}
        >
          <TabPane 
            tab={
              <span>
                <BarChartOutlined />
                Overview
              </span>
            } 
            key="overview"
          >
            <OverviewReport />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <LineChartOutlined />
                Stock Movement
              </span>
            } 
            key="movement"
          >
            <StockMovementReport />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <PieChartOutlined />
                Valuation
              </span>
            } 
            key="valuation"
          >
            <ValuationReport />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <BarChartOutlined />
                Low Stock
              </span>
            } 
            key="lowstock"
          >
            <LowStockReport />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <PieChartOutlined />
                ABC Analysis
              </span>
            } 
            key="abc"
          >
            <ABCAnalysisReport />
          </TabPane>
        </Tabs>
      </Card>

      <style jsx>{`
        .stores-reports {
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

export default StoresReports;
