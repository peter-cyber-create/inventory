import React from 'react';
import { Card, Alert } from 'antd';

const FNCard = ({ text }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, Arial, sans-serif', minHeight: 120 }}>
      <Card style={{ width: 400, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'var(--moh-header-bg)' }} bordered>
        <Alert
          message={text}
          type="info"
          showIcon
          style={{ background: 'var(--moh-header-bg)', color: 'var(--moh-primary)', border: '1px solid var(--moh-primary)', borderRadius: 8, fontWeight: 500, textAlign: 'center' }}
        />
      </Card>
    </div>
  );
};

export default FNCard;