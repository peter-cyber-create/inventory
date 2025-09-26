
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal';
import AddParts from './AddParts';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import FNCard from '../../../components/FNCard';
import { Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Parts = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [parts, setParts] = useState([]);
    const [results, setResults] = useState('');

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadParts = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/parts`);
            console.log(res)
            setParts(res?.data.parts);
            setResults(res?.data.results);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadParts();
    }, []);

    const tableColumns = [
        { key: 'partname', label: 'Part Name' },
        { key: 'partno', label: 'Part No' },
        { key: 'specification', label: 'Specification' },
        { key: 'quantity', label: 'Quantity Available ' },
        { key: 'qtyDispatched', label: 'Quantity Dispatched' },
    ];

    return (
      <Fragment>
        <FNModal
          showModal={showModal}
          handleClose={handleClose}
          lg=""
          title="Add Vehicle Parts"
        >
          <AddParts close={handleClose} refresh={loadParts} />
        </FNModal>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Vehicle Parts Listing</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Vehicle Parts</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Listing</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  style={{ width: 220, borderRadius: 8 }}
                  // onChange={handleSearch}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleShow}>
                  Add Vehicle Parts
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card style={{ borderRadius: 8 }}>
          {results === 0 ? <FNCard text="No Vehicle Parts Added In Store Yet ! " /> : <FNTable columns={tableColumns} data={parts} />}
        </Card>
      </Fragment>
    );
}

export default Parts