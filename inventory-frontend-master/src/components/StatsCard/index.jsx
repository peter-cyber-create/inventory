import React from 'react';
import { Card } from 'antd';

const StatsCard = ({ title, number, color }) => {
  // color prop can be used to set accent color for the number or border
  const accent = color || 'var(--moh-accent)';
  return (
    <div style={{ padding: 8, minWidth: 220, maxWidth: 320 }}>
      <Card
        bordered
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: 'var(--moh-header-bg)', borderLeft: `6px solid ${accent}` }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontFamily: 'Inter, Arial, sans-serif' }}>
          <span style={{ fontSize: 14, color: 'var(--moh-primary)', fontWeight: 500 }}>{title}</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: accent, marginTop: 8 }}>{number}</span>
        </div>
      </Card>
    </div>
  );
};

export default StatsCard;