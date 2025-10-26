import React from 'react';
import { Table as AntTable, Card, Typography } from 'antd';

const Table = ({ columns, data, actions, title }) => {
  // Convert columns to Ant Design format if needed
  const antdColumns = columns.map(col => ({
    ...col,
    title: col.label || col.title,
    dataIndex: col.key || col.dataIndex,
    key: col.key || col.dataIndex,
  }));

  return (
    <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
      {title && <Typography.Title level={5} style={{ marginBottom: 16 }}>{title}</Typography.Title>}
      <AntTable
        columns={antdColumns}
        dataSource={data}
        rowKey={(row, idx) => row.id || idx}
        pagination={{ pageSize: 10 }}
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        scroll={{ y: 350 }}
        bordered
      />
    </Card>
  );
};

export default Table;