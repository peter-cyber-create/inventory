import React from 'react';
import { Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const SearchFilters = ({ 
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    onSearch,
    filters = [],
    onFilterChange,
    onReset,
    loading = false
}) => {
    return (
        <Card 
            style={{ 
                marginBottom: '16px',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
            }}
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Search
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onSearch={onSearch}
                        enterButton={<SearchOutlined />}
                        loading={loading}
                        allowClear
                    />
                </Col>
                
                {filters.map((filter, index) => (
                    <Col xs={24} sm={12} md={6} lg={4} key={index}>
                        <Select
                            placeholder={filter.placeholder}
                            value={filter.value}
                            onChange={(value) => onFilterChange(filter.key, value)}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {filter.options.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                ))}
                
                <Col xs={24} sm={12} md={4} lg={3}>
                    <Space>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={onReset}
                            type="default"
                        >
                            Reset
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default SearchFilters;
