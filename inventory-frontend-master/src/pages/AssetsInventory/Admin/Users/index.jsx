import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../../../helpers/api";
import FNModal from '../../../../components/FNModal'
import Adduser from './AddUsers';
import FNSpinner from '../../../../components/FNSpinner'
import FNTable from '../../../../components/FNTable';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/users`);
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
        { key: 'id', label: 'User ID' },
        { key: 'username', label: 'Username' },
        { key: 'firstname', label: 'First Name' },
        { key: 'lastname', label: 'lastname' },
        { key: 'role', label: 'role' },
        { key: 'phoneNo', label: 'Phone No' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add Inventory User"
            >
                <Adduser close={handleClose} refresh={loadUsers} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Inventory Users</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Users</Link></li>
                                <li class="breadcrumb-item active">Listing</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? <FNSpinner /> :
                <>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row mb-2">
                                                <div class="col-sm-4">
                                                    <div class="search-box me-2 mb-2 d-inline-block">
                                                        <div class="position-relative">
                                                            <input type="text" class="form-control" id="searchTableList" placeholder="Search..." />
                                                            <i class="bx bx-search-alt search-icon"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-8">
                                                    <div class="text-sm-end">
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add New User</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={users} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </Fragment>
    )
}

export default Users