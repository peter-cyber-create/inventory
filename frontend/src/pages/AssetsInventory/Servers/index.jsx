
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import { toast } from "react-toastify";
import FNModal from '../../../components/FNModal';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import AddServer from './AddServer';
import EditServer from './EditServer';
import { PageHeader, Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';


const Servers = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState([]);
    const [id, setId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdate] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const updateClose = () => setUpdate(false);

    const history = useHistory();

    const loadServers = async () => {
        setLoading(true);
        try {
            const res = await API.get("/servers");
            console.log(res)
            setAssets(res.data.servers);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        history.push(`/ict/servers/${id}`);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        await API.delete(`/legal/${id}`)
            .then(() => {
                setLoading(false);
                toast.success(`Server Successfully Deleted`);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(`Failed in Deleting Server`);
            });
        loadServers();
    };

    useEffect(() => {
        loadServers();
    }, []);

    const tableColumns = [
        { key: 'serverName', label: 'Server Name' },
        { key: 'serialNo', label: 'Serial Number' },
        { key: 'engranvedNo', label: 'Engraved Number' },
        { key: 'productNo', label: 'Product Number' },
        { key: 'memory', label: 'Memory' },
        { key: 'hardDisk', label: 'Hard Disk' }
    ];

    return (
      <Fragment>
        <FNModal
          showModal={showModal}
          handleClose={handleClose}
          lg="lg"
          title="Add New Server"
        >
          <AddServer close={handleClose} refresh={loadServers} />
        </FNModal>
        <FNModal
          showModal={updateModal}
          handleClose={updateClose}
          lg="lg"
          title="Update Server"
        >
          <EditServer close={updateClose} refresh={loadServers} id={id} />
        </FNModal>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Servers Assets Listing</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Assets</Link></Breadcrumb.Item>
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
                  Add New Server
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

export default Servers