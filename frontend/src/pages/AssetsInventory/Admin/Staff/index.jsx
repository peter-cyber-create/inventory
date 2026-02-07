import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../../../helpers/api";
import FNModal from '../../../../components/FNModal'
import AddStaff from './AddStaff';
import FNSpinner from '../../../../components/FNSpinner'

const Staff = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const onViewDetails = () => {
        console.log()
    }

    const handleEdit = () => {
        console.log()
    }

    const handleDelete = () => {
        console.log()
    }

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/api/staff`);
            console.log(res)
            // Defensively normalize: ensure we always have an array
            const usersList = Array.isArray(res?.data?.staff) 
                ? res.data.staff 
                : Array.isArray(res?.data) 
                    ? res.data 
                    : [];
            setUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            // On error, set empty array to prevent .map() crashes
            setUsers([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add Inventory User"
            >
                <AddStaff close={handleClose} refresh={loadUsers} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">MOH HQ Staff</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Staff</Link></li>
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
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add New Staff</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table align-middle table-striped table-sm">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Department</th>
                                                            <th>Division</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(users) && users.map((user, index) => (
                                                            <tr key={index}>
                                                                <td>{user.depart.name}</td>
                                                                <td>{user.division.name}</td>
                                                                <td>{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td>
                                                                    <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                        <a onClick={() => onViewDetails(user.id)} class="action-icon text-primary" style={{ cursor: 'pointer' }}>
                                                                            <i class="mdi mdi-eye font-size-20"></i></a>
                                                                    </div>
                                                                    <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                        <a onClick={() => handleEdit(user.id)} class="action-icon text-warning" style={{ cursor: 'pointer' }}>
                                                                            <i class="mdi mdi-comment-edit-outline font-size-20"></i></a>
                                                                    </div>
                                                                    <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                        <a onClick={() => handleDelete(user.id)} class="action-icon text-danger" style={{ cursor: 'pointer' }}>
                                                                            <i class="mdi mdi-trash-can font-size-20"></i></a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
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

export default Staff