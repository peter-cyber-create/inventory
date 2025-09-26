import React from 'react';
import { Card, Button } from 'antd';
import { SettingFilled } from '@ant-design/icons';

const FNEmpty = ({ open, title, title1, title2 }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, Arial, sans-serif', minHeight: 120 }}>
      <Card
        style={{ background: 'var(--moh-header-bg)', color: 'var(--moh-primary)', border: '1px solid var(--moh-primary)', borderRadius: 8, maxWidth: 500, width: '100%' }}
        bordered
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h5 style={{ color: 'var(--moh-accent)', fontWeight: 600, marginBottom: 12 }}>{title}</h5>
            <p style={{ marginBottom: 0 }}>{title1}</p>
          </div>
          <Button
            type="primary"
            icon={<SettingFilled />}
            onClick={open}
            style={{ borderRadius: 6, fontWeight: 500, marginLeft: 16 }}
          >
            {title2}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FNEmpty;