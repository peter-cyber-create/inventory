import { Card, Row, Col, Typography, Space } from 'antd';
import { CopyOutlined, InboxOutlined, TagsOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const moduleCards = [
  {
    title: 'Total Assets',
    value: 50,
    icon: <CopyOutlined style={{fontSize: 32, color: '#006747'}} />,
    link: '/assets',
  },
  {
    title: 'Disposed Assets',
    value: 20,
    icon: <InboxOutlined style={{fontSize: 32, color: '#E53935'}} />,
    link: '/assets/disposed',
  },
  {
    title: 'Facility Assets',
    value: 100,
    icon: <TagsOutlined style={{fontSize: 32, color: '#FFD600'}} />,
    link: '/assets/facility',
  },
  {
    title: 'Written Off Assets',
    value: 80,
    icon: <DeleteOutlined style={{fontSize: 32, color: '#BDBDBD'}} />,
    link: '/assets/writtenoff',
  },
  // Add more modules as needed
];

// Placeholder Chart component
const Chart = () => (
  <div style={{height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18}}>
    [Chart Placeholder]
  </div>
);

const Dashboard = () => {
  const history = useHistory();
  return (
    <Space direction="vertical" style={{width: '100%'}} size={32}>
      <Typography.Title level={3} style={{margin: 0}}>HQ Inventory Dashboard</Typography.Title>
      <Row gutter={[24, 24]}>
        {moduleCards.map(card => (
          <Col xs={24} sm={12} md={6} key={card.title}>
            <Card
              hoverable
              onClick={() => history.push(card.link)}
              style={{borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer'}}>
              <Space align="center" size={16}>
                {card.icon}
                <div>
                  <Typography.Text type="secondary">{card.title}</Typography.Text>
                  <Typography.Title level={4} style={{margin: 0}}>{card.value}</Typography.Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Card style={{marginTop: 32}}>
        <Typography.Title level={5}>Assets Per Department</Typography.Title>
        <Chart />
      </Card>
    </Space>
  );
};

export default Dashboard;