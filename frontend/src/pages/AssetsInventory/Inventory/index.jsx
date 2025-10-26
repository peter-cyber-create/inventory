import React, { useState, useEffect, Fragment } from 'react'
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';

const Inventory = () => {
    const [loading, setLoading] = useState(false);
    const [inventory, setInventory] = useState([]);

    const history = useHistory();

    const handleView = (id) => {
        history.push(`/ict/assets/${id}`);
    };

    const loadDispatch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/issue/inventory`);
            console.log(res)
            setInventory(res?.data.assets);
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
        { key: 'description', label: 'Description' },
        { key: 'staff.depart.name', label: 'Department' },
        { key: 'staff.division.name', label: 'Division / Section' },
        // { key: 'model.name', label: 'Model' },
        // { key: 'serialNo', label: 'Serial No' },
        // { key: 'engravedNo', label: 'Engraved No' },
        // { key: 'funder', label: 'Funder' },
        { key: 'staff.name', label: 'User' },
        { key: 'staff.title', label: 'Title' },
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
                        <h4 class="mb-sm-0 font-size-18">ICT Assets Inventory</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">ICT Inventory</Link></li>
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
                                            </div>
                                            <FNTable columns={tableColumns} data={inventory} onViewDetails={handleView} text="View Asset Details" />
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

export default Inventory