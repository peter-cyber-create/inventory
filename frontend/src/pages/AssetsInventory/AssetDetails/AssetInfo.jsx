/**
 * Ministry of Health Uganda - Asset Information Component
 * Official asset register format - Dense, readable information display
 */
import React from 'react';
import { Descriptions, Card, Typography } from 'antd';
import '../../../theme/moh-institutional-theme.css';

const { Text } = Typography;

const AssetInfo = ({ asset }) => {
    if (!asset) {
        return (
            <Card className="institutional-card" style={{ border: '1px solid #E1E5E9', borderRadius: '8px' }}>
                <Text type="secondary">Loading asset information...</Text>
            </Card>
        );
    }

    return (
        <div>
            <Card 
                className="institutional-card"
                style={{ 
                    border: '1px solid #E1E5E9',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                    marginBottom: '24px'
                }}
            >
                <Descriptions
                    title={
                        <Text strong style={{ color: '#006747', fontSize: '16px' }}>
                            Asset Identification
                        </Text>
                    }
                    bordered
                    column={3}
                    size="middle"
                    labelStyle={{
                        backgroundColor: '#FAFBFC',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        width: '180px',
                        borderRight: '1px solid #E2E8F0'
                    }}
                    contentStyle={{
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A'
                    }}
                >
                    <Descriptions.Item label="Serial Number">
                        <Text>{asset.serialNo || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Engraved Number">
                        <Text>{asset.engravedNo || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Number">
                        <Text>{asset.orderNo || 'N/A'}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card 
                className="institutional-card"
                style={{ 
                    border: '1px solid #E1E5E9',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                    marginBottom: '24px'
                }}
            >
                <Descriptions
                    title={
                        <Text strong style={{ color: '#006747', fontSize: '16px' }}>
                            Asset Classification
                        </Text>
                    }
                    bordered
                    column={3}
                    size="middle"
                    labelStyle={{
                        backgroundColor: '#FAFBFC',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        width: '180px',
                        borderRight: '1px solid #E2E8F0'
                    }}
                    contentStyle={{
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A'
                    }}
                >
                    <Descriptions.Item label="Category">
                        <Text>{asset.category?.name || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Type">
                        <Text>{asset.type?.name || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Model">
                        <Text>{asset.model?.name || 'N/A'}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card 
                className="institutional-card"
                style={{ 
                    border: '1px solid #E1E5E9',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                    marginBottom: '24px'
                }}
            >
                <Descriptions
                    title={
                        <Text strong style={{ color: '#006747', fontSize: '16px' }}>
                            Technical Specifications
                        </Text>
                    }
                    bordered
                    column={3}
                    size="middle"
                    labelStyle={{
                        backgroundColor: '#FAFBFC',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        width: '180px',
                        borderRight: '1px solid #E2E8F0'
                    }}
                    contentStyle={{
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A'
                    }}
                >
                    <Descriptions.Item label="Processor">
                        <Text>{asset.processor || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Memory">
                        <Text>{asset.memory || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Storage">
                        <Text>{asset.storage || 'N/A'}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card 
                className="institutional-card"
                style={{ 
                    border: '1px solid #E1E5E9',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)',
                    marginBottom: '24px'
                }}
            >
                <Descriptions
                    title={
                        <Text strong style={{ color: '#006747', fontSize: '16px' }}>
                            Procurement Information
                        </Text>
                    }
                    bordered
                    column={3}
                    size="middle"
                    labelStyle={{
                        backgroundColor: '#FAFBFC',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        width: '180px',
                        borderRight: '1px solid #E2E8F0'
                    }}
                    contentStyle={{
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A'
                    }}
                >
                    <Descriptions.Item label="Supplier">
                        <Text>{asset.supplier || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Funding Source">
                        <Text>{asset.funding || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Funder">
                        <Text>{asset.funder || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Purchase Cost">
                        <Text>{asset.purchaseCost ? `UGX ${asset.purchaseCost.toLocaleString()}` : 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Purchase Date">
                        <Text>{asset.purchaseDate || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Warranty">
                        <Text>{asset.warranty || 'N/A'}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}

export default AssetInfo