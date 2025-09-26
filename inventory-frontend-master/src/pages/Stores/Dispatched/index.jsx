
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNEmpty from '../../../components/FNEmpty';
import FNTable from '../../../components/FNTable';
import { Breadcrumb, Input, Row, Col, Typography, Space, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Dispatched = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [requistions, setRequisitions] = useState([]);
    const [id, setId] = useState("");
    const [model, setModel] = useState("");
    const [serialNo, setSerialNo] = useState("");

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadAsset = async (id) => {
        setLoading(true);
        try {
            const res = await API.get(`/requisition/asset/${id}`);
            console.log(res)
            setModel(res?.data.asset.model.modelName);
            setSerialNo(res?.data.asset.serialNo)
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        handleShow()
        setId(id)
        loadAsset(id)
    };

    const loadDispatch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/dispatch/stores`);
            console.log(res)
            setRequisitions(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };



    useEffect(() => {
        loadDispatch();
    }, []);

    const tableColumns = [
        { key: 'serialNo', label: 'Serial No' },
        { key: 'model', label: 'Model' },
        { key: 'dispatchedBy', label: 'Dispatched By' },
        { key: 'dispatchedTo', label: 'Dispatched To' },
        {
            key: 'createdAt',
            label: 'Dispatched Date',
            formatter: (createdAt) => moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')
        },
    ];

    return (
      <Fragment>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Stores Dispatched Items</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Stores Dispatched</Link></Breadcrumb.Item>
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
              </Space>
            </Col>
          </Row>
        </Card>
        {requistions.length > 0 ? (
          <Card style={{ borderRadius: 8 }}>
            <FNTable columns={tableColumns} data={requistions} onViewDetails={handleView} text="View Details" />
          </Card>
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <FNEmpty
              title="No Dispatched Items"
              title1="You currently have no dispatched items yet"
              title2=""
            />
          </Card>
        )}
      </Fragment>
    );
}

export default Dispatched