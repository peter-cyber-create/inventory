import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import API from "../../helpers/api";
import { toast } from "react-toastify";
import FNModal from '../../components/FNModal'
import AddAsset from './AddAsset'
import EditAsset from './EditAsset';
import FNSpinner from '../../components/FNSpinner'
import FNTable from '../../components/FNTable';

const AssetsInventory = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState([]);
    const [id, setId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdate] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const updateClose = () => setUpdate(false);

    const history = useHistory();

    const loadAssets = async () => {
        setLoading(true);
        try {
            const res = await API.get("/asset");
            console.log(res)
            setAssets(res.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        history.push(`/ict/assets/${id}`);
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const tableColumns = [
        { key: 'serialNo', label: 'Serial No' },
        { key: 'engranvedNo', label: 'Engraved No' },
        { key: 'category', label: 'Category' },
        { key: 'make', label: 'Make' },
        { key: 'model', label: 'Model' },
        { key: 'user', label: 'User' },
        { key: 'department', label: 'Department' },
        { key: 'officeNo', label: 'Office No' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="xl"
                title="Add ICT Asset"
            >
                <AddAsset close={handleClose} refresh={loadAssets} />
            </FNModal>
            <FNModal
                showModal={updateModal}
                handleClose={updateClose}
                lg="lg"
                title="Update Law"
            >
                <EditAsset close={updateClose} refresh={loadAssets} id={id} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">ICT Assets Listing</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Assets</Link></li>
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
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add New Asset</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={assets} onViewDetails={handleView} />
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

export default AssetsInventory