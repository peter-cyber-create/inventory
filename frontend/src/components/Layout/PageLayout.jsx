import React from 'react';
import { Card, Typography, Space, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const { Title, Text } = Typography;

const PageLayout = ({ 
    title, 
    subtitle, 
    showBackButton = false, 
    backPath = '/admin/dashboard',
    extra = null,
    children,
    loading = false 
}) => {
    const history = useHistory();

    const handleBack = () => {
        history.push(backPath);
    };

    return (
        <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Card 
                style={{ 
                    marginBottom: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                loading={loading}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space direction="vertical" size={0}>
                            <Space align="center">
                                {showBackButton && (
                                    <Button 
                                        icon={<ArrowLeftOutlined />} 
                                        onClick={handleBack}
                                        type="text"
                                        style={{ marginRight: '8px' }}
                                    >
                                        Back
                                    </Button>
                                )}
                                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                    {title}
                                </Title>
                            </Space>
                            {subtitle && (
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    {subtitle}
                                </Text>
                            )}
                        </Space>
                    </Col>
                    {extra && (
                        <Col>
                            {extra}
                        </Col>
                    )}
                </Row>
            </Card>
            
            <Card 
                style={{ 
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                {children}
            </Card>
        </div>
    );
};

export default PageLayout;
