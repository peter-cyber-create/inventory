import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import FNModal from '../../../../components/FNModal'
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner';
import FNTable from '../../../../components/FNTable';
import AddType from './AddType';

const Type = () => {
    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const history = useHistory();

    const handleView = (id) => {
        history.push(`/fleet/vehicle/${id}`);
    };

    const loadType = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/v/type`);
            console.log(res)
            setTypes(res?.data.type);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadType();
    }, []);

    const tableColumns = [
        { key: 'id', label: 'Type ID' },
        { key: 'name', label: 'Vehicle Type Name' },
        { key: 'createdAt', label: 'Created At' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg=""
                title="Add New Vehicle Type"
            >
                <AddType close={handleClose} refresh={loadType} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Vehicle Types</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Vehicle Types</Link></li>
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
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add New Vehicle Type</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={types} onViewDetails={handleView} text="View Type Details" />
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

export default Type