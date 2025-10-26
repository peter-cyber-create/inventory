import React from 'react';
import { Card, Typography, Row, Col, Button, Space, Alert } from 'antd';
import { FileTextOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Form76A from './Form76A';

const { Title, Text } = Typography;

const Requisition = () => {
  const navigate = useNavigate();

  const requisitionTypes = [
    {
      id: 'form76a',
      name: 'Form 76A - Stores Requisition/Issue Voucher',
      description: 'Official Ministry of Health requisition form with physical signatures',
      icon: <FileTextOutlined />,
      color: '#1890ff',
      path: '/stores/form76a'
    },
    {
      id: 'emergency',
      name: 'Emergency Requisition',
      description: 'Quick requisition for emergency situations',
      icon: <FileTextOutlined />,
      color: '#ff4d4f',
      path: '/stores/requisition/emergency'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Requisition',
      description: 'Requisitions for maintenance and repair items',
      icon: <FileTextOutlined />,
      color: '#52c41a',
      path: '/stores/requisition/maintenance'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="requisition">
      <Card>
        <div className="page-header">
          <div>
            <Title level={2}>Requisitions</Title>
            <Text type="secondary">Manage different types of stock requisitions</Text>
          </div>
        </div>

        <Alert
          message="Requisition Types"
          description="Choose the appropriate requisition type based on your needs. Form 76A is the official MOH requisition form."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Row gutter={[24, 24]}>
          {requisitionTypes.map((type) => (
            <Col xs={24} sm={12} lg={8} key={type.id}>
              <Card
                hoverable
                style={{ 
                  height: '100%',
                  border: `2px solid ${type.color}20`,
                  borderRadius: '8px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div 
                    style={{ 
                      fontSize: '48px', 
                      color: type.color,
                      marginBottom: '16px'
                    }}
                  >
                    {type.icon}
                  </div>
                  
                  <Title level={4} style={{ marginBottom: '8px' }}>
                    {type.name}
                  </Title>
                  
                  <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
                    {type.description}
                  </Text>
                  
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => handleNavigate(type.path)}
                      style={{ backgroundColor: type.color, borderColor: type.color }}
                    >
                      Create New
                    </Button>
                    <Button 
                      icon={<EyeOutlined />}
                      onClick={() => handleNavigate(`${type.path}/list`)}
                    >
                      View All
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Stats */}
        <Card 
          title="Requisition Statistics" 
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  0
                </div>
                <Text type="secondary">Form 76A</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  0
                </div>
                <Text type="secondary">Emergency</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  0
                </div>
                <Text type="secondary">Maintenance</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  0
                </div>
                <Text type="secondary">Pending</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Recent Activity */}
        <Card 
          title="Recent Requisitions" 
          style={{ marginTop: 24 }}
          extra={<Button type="link">View All</Button>}
        >
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
            <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>No recent requisitions</div>
            <Text type="secondary">Create your first requisition to get started</Text>
          </div>
        </Card>
      </Card>

      <style jsx>{`
        .requisition {
          padding: 24px;
        }
        
        .page-header {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default Requisition;
