import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../../../helpers/api";
import FNModal from '../../../../components/FNModal'
import AddType from './AddType';
import FNSpinner from '../../../../components/FNSpinner'
import FNTable from '../../../../components/FNTable';

const Types = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [types, setTypes] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/api/type`);
            console.log(res)
            // Defensively normalize: ensure we always have an array
            const typesList = Array.isArray(res?.data?.type) 
                ? res.data.type 
                : Array.isArray(res?.data?.assets) 
                    ? res.data.assets 
                    : Array.isArray(res?.data) 
                        ? res.data 
                        : [];
            setTypes(typesList);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            // On error, set empty array to prevent .map() crashes
            setTypes([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const tableColumns = [
        { key: 'name', label: 'ICT Asset Type' },
        { key: 'description', label: 'Description' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add ICT Asset Type"
            >
                <AddType close={handleClose} refresh={loadCategories} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Asset Types Listing</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Asset  Types</Link></li>
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
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add Asset Type</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={types} />
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

export default Types