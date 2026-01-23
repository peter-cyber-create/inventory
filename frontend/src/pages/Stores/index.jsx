
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import API from "../../helpers/api";
import { toast } from "react-toastify";
import FNModal from '../../components/FNModal';
import FNSpinner from '../../components/FNSpinner';
import FNTable from '../../components/FNTable';
import { PageHeader, Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Stores = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState([]);
    const [id, setId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdate] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const updateClose = () => setUpdate(false);

    const history = useHistory();

    const loadAssets = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/api/assets`);
            console.log(res)
            setAssets(res.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        history.push(`/ict/assets/${id}`);
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const tableColumns = [
        { key: 'serialNo', label: 'Serial No' },
        { key: 'engranvedNo', label: 'Engraved No' },
        { key: 'category', label: 'Category' },
        { key: 'make', label: 'Make' },
        { key: 'model', label: 'Model' },
        { key: 'user', label: 'User' },
        { key: 'department', label: 'Department' },
        { key: 'officeNo', label: 'Office No' },
    ];

    return (
      <Fragment>
        {/* Uncomment and implement AddAsset/EditAsset modals as needed */}
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Stores Inventory Listing</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Stores</Link></Breadcrumb.Item>
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
                  Add New Asset
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        {loading ? (
          <FNSpinner />
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <FNTable columns={tableColumns} data={assets} onViewDetails={handleView} />
          </Card>
        )}
      </Fragment>
    );
}

export default Stores