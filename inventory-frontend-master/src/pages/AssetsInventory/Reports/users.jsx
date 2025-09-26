import React, { useState, useEffect, Fragment } from 'react'
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import DownloadExcel from "../../../components/FNDownload";

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const history = useHistory();

    const handleView = (id) => {
        history.push(`/ict/assets/${id}`);
    };

    const loadDispatch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/issue/users`);
            console.log(res)
            setUsers(res?.data.assets);
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
        { key: 'issuedTo', label: 'Current User' },
        { key: 'department', label: 'Department' },
        { key: 'title', label: 'Title' },
        { key: 'model', label: 'Model' },
        { key: 'serialNo', label: 'Serial No' },
        { key: 'issuedBy', label: 'Issued By' },
        { key: 'createdAt', label: 'Create Date' },
    ];

    return (
        <Fragment>
            {/* <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg=""
                title="ICT Devices Issuance Form"
            >
                <AddDispatch
                    close={handleClose}
                    refresh={loadDispatch}
                    id={id}
                    model={model}
                    serialNo={serialNo}
                    setModel={setModel}
                    setSerialNo={setSerialNo}
                    assetId={assetId}
                />
            </FNModal> */}
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">ICT Assets Assigned Users Report</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">ICT Users</Link></li>
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
                                                <div class="">
                                                    <div class="me-2 mb-2 d-inline-block">
                                                        <div class="position-relative">
                                                            <input type="text" class="form-control" id="searchTableList" placeholder="Search..." />
                                                        </div>
                                                    </div>
                                                    <div class="float-end">
                                                        <a href="javascript:window.print()" class="btn btn-success waves-effect waves-light me-1"><i class="fa fa-print"></i></a>
                                                        <a onClick={() => DownloadExcel(users, "Users Report")} class="btn btn-primary waves-effect waves-light me-1"><i class="bx bx-download"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={users} onViewDetails={handleView} text="" />
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