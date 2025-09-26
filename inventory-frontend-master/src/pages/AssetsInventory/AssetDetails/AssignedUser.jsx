import React, { useState, useEffect } from 'react'
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal'
import AssignUser from './Popups/AssignUser';
import pic from './user.jpg'

const AssisgnedUser = ({ id }) => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const getUser = async () => {
        setLoading(true)
        try {
            const res = await API.get(`/issue/user/${id}`);
            console.log("Issue User ==>", res)
            setLoading(false);
            setUser(res.data.asset);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div class="tab-pane" id="user" role="tabpanel">
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Assign Asset To User"
            >
                <AssignUser close={handleClose} id={id} />
            </FNModal>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-start">
                                <div class="flex-shrink-0 me-3">
                                    <img src={pic} alt="" class="avatar-md rounded-circle img-thumbnail" />
                                </div>
                                <div class="flex-grow-1 align-self-center">
                                    {/* <div class="text-muted">
                                        <h5>{asset.user}</h5>
                                        <p class="mb-1">{asset.email}</p>
                                        <p class="mb-0">{asset.department}</p>
                                        <p class="mb-0">{asset.officeNo}</p>
                                    </div> */}
                                    <div class="table-responsive">
                                        <table class="table table-nowrap mb-0">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Staff Names :</th>
                                                    <td><h5>{user.staff && user.staff.name}</h5></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Title :</th>
                                                    <td>{user.staff && user.staff.title}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Department :</th>
                                                    <td>{user.staff && user.staff.depart.name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Division / Section / Unit :</th>
                                                    <td>{user.staff && user.staff.division.name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Issued On :</th>
                                                    <td>{user.createdAt}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Issued By :</th>
                                                    <td><h5>{user.issuedBy}</h5></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dropdown">
                                    <button type="button" class="btn btn-warning" onClick={handleShow}>
                                        <i class="mdi mdi-wallet me-1"></i>
                                        <span class="d-none d-sm-inline-block">
                                            Assign Asset
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssisgnedUser