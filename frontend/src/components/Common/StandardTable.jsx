import React from 'react';
import { Table, Card, Typography, Button, Space } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title } = Typography;

const StandardTable = ({ 
    title,
    dataSource = [],
    columns = [],
    loading = false,
    pagination = true,
    showCreateButton = true,
    createButtonText = "Create New",
    onCreateClick,
    onViewClick,
    onEditClick,
    onDeleteClick,
    onPrintClick,
    rowKey = "id",
    size = "middle",
    scroll = null,
    extra = null
}) => {
    
    // Enhanced columns with standard actions
    const enhancedColumns = [
        ...columns,
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    {onViewClick && (
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => onViewClick(record)}
                            size="small"
                        >
                            View
                        </Button>
                    )}
                    {onEditClick && (
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => onEditClick(record)}
                            size="small"
                        >
                            Edit
                        </Button>
                    )}
                    {onPrintClick && (
                        <Button
                            type="link"
                            icon={<PrinterOutlined />}
                            onClick={() => onPrintClick(record)}
                            size="small"
                        >
                            PDF
                        </Button>
                    )}
                    {onDeleteClick && (
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDeleteClick(record)}
                            size="small"
                        >
                            Delete
                        </Button>
                    )}
                </Space>
            ),
        }
    ];

    const defaultPagination = {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    return (
        <Card 
            style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <div style={{ 
                marginBottom: 16, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    {title}
                </Title>
                <Space>
                    {extra}
                    {showCreateButton && onCreateClick && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onCreateClick}
                        >
                            {createButtonText}
                        </Button>
                    )}
                </Space>
            </div>

            <Table
                columns={enhancedColumns}
                dataSource={dataSource}
                loading={loading}
                rowKey={rowKey}
                size={size}
                scroll={scroll}
                pagination={pagination ? defaultPagination : false}
                style={{
                    backgroundColor: '#fff'
                }}
            />
        </Card>
    );
};

export default StandardTable;
