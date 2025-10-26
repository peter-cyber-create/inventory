import React from 'react';
import { Typography, Button, Space } from 'antd';
import { PrinterOutlined, CloudDownloadOutlined } from '@ant-design/icons';

const TopNav = ({ title, onclick, heading }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title>
      <Space>
        <Button type="default" icon={<PrinterOutlined />} style={{ marginRight: 8 }}>
          Export
        </Button>
        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={onclick}>
          {heading}
        </Button>
      </Space>
    </div>
  );
};

export default TopNav;