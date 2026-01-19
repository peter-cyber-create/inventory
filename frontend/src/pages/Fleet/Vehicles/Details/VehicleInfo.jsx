/**
 * Ministry of Health Uganda - Vehicle Information Component
 * Official vehicle register format - Dense, readable information display
 */
import React from "react";
import { Descriptions, Card, Typography } from 'antd';
import '../../../../theme/moh-institutional-theme.css';

const { Text } = Typography;

const VehicleInfo = ({ vehicle }) => {
  if (!vehicle) {
    return (
      <Card className="institutional-card" style={{ border: '1px solid #E1E5E9', borderRadius: '8px' }}>
        <Text type="secondary">Loading vehicle information...</Text>
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
              Vehicle Identification
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
          <Descriptions.Item label="Old Number Plate">
            <Text>{vehicle.old_number_plate || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="New Number Plate">
            <Text>{vehicle.new_number_plate || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            <Text>{vehicle.type || 'N/A'}</Text>
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
              Vehicle Specifications
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
          <Descriptions.Item label="Make">
            <Text>{vehicle.make || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Chassis No">
            <Text>{vehicle.chassis_no || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Engine No">
            <Text>{vehicle.engine_no || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Year of Manufacture">
            <Text>{vehicle.YOM || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Fuel Type">
            <Text>{vehicle.fuel || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Engine CC">
            <Text>{vehicle.power || 'N/A'}</Text>
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
              Procurement & Assignment
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
          <Descriptions.Item label="Total Cost">
            <Text>{vehicle.total_cost ? `UGX ${vehicle.total_cost.toLocaleString()}` : 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Country of Origin">
            <Text>{vehicle.country_of_origin || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="User Department">
            <Text>{vehicle.user_department || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Officer">
            <Text>{vehicle.officer || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Driver">
            <Text>{vehicle.driver || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Contact">
            <Text>{vehicle.contact || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mileage">
            <Text>{vehicle.mileage ? `${vehicle.mileage} km` : 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Sticker No">
            <Text>{vehicle.sticker_no || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Age">
            <Text>{vehicle.age ? `${vehicle.age} years` : 'N/A'}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default VehicleInfo;
