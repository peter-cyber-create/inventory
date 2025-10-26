import React from 'react';
import { Spin } from 'antd';

const FNSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Spin size="large" style={{ color: 'var(--moh-primary)' }} tip="Loading..." />
    </div>
  );
};

export default FNSpinner;