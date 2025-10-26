
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal';
import AddRegister from './AddRegister';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import FNCard from '../../../components/FNCard';
import { PageHeader, Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [assets, setAssets] = useState([]);
    const [results, setResults] = useState('');

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadModel = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/assets`);
            console.log(res)
            setAssets(res?.data.assets);
            setResults(res?.data.results);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadModel();
    }, []);

    const tableColumns = [
        { key: 'category.name', label: 'Category' },
        { key: 'brand.name', label: 'Brand' },
        { key: 'model.name', label: 'Model' },
        { key: 'serialNo', label: 'Serial No' },
        { key: 'engravedNo', label: 'Engraved No' },
        { key: 'funder', label: 'Funder' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'status', label: 'Status' },
    ];

    return (
      <Fragment>
        <FNModal
          showModal={showModal}
          handleClose={handleClose}
          lg="xl"
          title="Add Asset Details To Asset Register"
        >
          <AddRegister close={handleClose} refresh={loadModel} />
        </FNModal>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Asset Register Listing</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Asset Register</Link></Breadcrumb.Item>
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
        <Card style={{ borderRadius: 8 }}>
          {results === 0 ? <FNCard text="No Assets Added To The Assets Register Yet ! " /> : <FNTable columns={tableColumns} data={assets} />}
        </Card>
      </Fragment>
    );
}

export default Register