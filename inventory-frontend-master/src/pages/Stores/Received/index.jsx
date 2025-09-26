
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal';
import AddReceived from './AddReceived';
import ReceivedDetails from './ReceivedDetails';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import { PageHeader, Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Received = () => {
    const [loading, setLoading] = useState(false);
    const [Floading, setFLoading] = useState(false);
    const [id, setId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);
    const [goods, setGoods] = useState([]);
    const [items, setItems] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const showDetails = () => setDetailsModal(true);
    const closeDetails = () => setDetailsModal(false);

    const loadItems = async (id) => {
        setFLoading(true);
        try {
            const res = await API.get(`/goods/received/items/${id}`);
            console.log(res)
            setItems(res?.data.items);
            setFLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const loadGoods = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/goods/received`);
            console.log(res)
            setGoods(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        showDetails()
        loadItems(id)
    };

    useEffect(() => {
        loadGoods();
    }, []);

    const tableColumns = [
        { key: 'deliveryDate', label: 'Delivery Date' },
        { key: 'supplier', label: 'Consignor' },
        { key: 'RefNo', label: 'Procurment Ref N0' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'NoteNo', label: 'Delivery Note No' },
        { key: 'invoiceNo', label: 'Invoice No' },
        { key: 'status', label: 'Status' },
        { key: 'ReceivedBy', label: 'Received By' },
    ];

    return (
      <Fragment>
        <FNModal
          showModal={showModal}
          handleClose={handleClose}
          lg="xl"
          title="Receive Goods"
        >
          <AddReceived close={handleClose} refresh={loadGoods} />
        </FNModal>
        <FNModal
          showModal={detailsModal}
          handleClose={closeDetails}
          lg="lg"
          title="Goods Received Items Details"
        >
          <ReceivedDetails close={closeDetails} items={items} id={id} />
        </FNModal>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Goods Received Listing</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Goods Received</Link></Breadcrumb.Item>
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
                  Add Goods Received
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        {loading ? (
          <FNSpinner />
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <FNTable columns={tableColumns} data={goods} onViewDetails={handleView} />
          </Card>
        )}
      </Fragment>
    );
}

export default Received