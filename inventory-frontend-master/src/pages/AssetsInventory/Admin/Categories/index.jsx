import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../../../helpers/api";
import FNModal from '../../../../components/FNModal'
import AddCategory from './AddCategory';
import FNSpinner from '../../../../components/FNSpinner'
import FNTable from '../../../../components/FNTable';

const Categories = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [goods, setGoods] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/category`);
            console.log(res)
            setGoods(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const tableColumns = [
        { key: 'id', label: 'ID' },
        { key: 'type.name', label: 'ICT Asset Type' },
        { key: 'name', label: 'ICT Asset Category Name' },
        { key: 'description', label: 'Description' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add Asset Category"
            >
                <AddCategory close={handleClose} refresh={loadCategories} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Asset Categories Listing</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Asset  Categories</Link></li>
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
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add Asset Category</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={goods} />
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

export default Categories