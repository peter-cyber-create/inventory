
import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal';
import Adduser from './AddUser';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import { PageHeader, Breadcrumb, Input, Button, Row, Col, Typography, Space, Card } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/users/finance`);
            console.log(res)
            setUsers(res?.data.users);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const tableColumns = [
        { key: 'username', label: 'Username' },
        { key: 'firstname', label: 'First Name' },
        { key: 'lastname', label: 'lastname' },
        { key: 'role', label: 'role' },
        { key: 'module', label: 'Module' },
        { key: 'depart', label: 'Department' },
    ];

    return (
      <Fragment>
        <FNModal
          showModal={showModal}
          handleClose={handleClose}
          lg="lg"
          title="Activity Tracker User Module"
        >
          <Adduser close={handleClose} refresh={loadUsers} />
        </FNModal>
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>Inventory Users</Typography.Title>
              <Breadcrumb style={{ marginTop: 8 }}>
                <Breadcrumb.Item><Link to="/ict/assets">Users</Link></Breadcrumb.Item>
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
                  Add New User
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        {loading ? (
          <FNSpinner />
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <FNTable columns={tableColumns} data={users} />
          </Card>
        )}
      </Fragment>
    );
}

export default Users