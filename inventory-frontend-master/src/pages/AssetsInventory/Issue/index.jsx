import React, { useState, useEffect, Fragment } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal'
import AddDispatch from './AddIssue';
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';

const Issue = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [requistions, setRequisitions] = useState([]);
    const [id, setId] = useState("");
    const [model, setModel] = useState("");
    const [serialNo, setSerialNo] = useState("");
    const [assetId, setAssetId] = useState("");

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadDispatchs = async (id) => {
        setLoading(true);
        try {
            const res = await API.get(`/dispatch/stores/${id}`);
            console.log(res)
            setModel(res?.data.asset.model);
            setSerialNo(res?.data.asset.serialNo);
            setAssetId(res?.data.asset.assetId)
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        handleShow()
        setId(id)
        loadDispatchs(id)
    };

    const loadDispatch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/dispatch/stores`);
            console.log(res)
            setRequisitions(res?.data.assets);
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
        { key: 'serialNo', label: 'Serial No' },
        { key: 'model', label: 'Model' },
        { key: 'dispatchedBy', label: 'Dispatched From Stores By' },
        { key: 'dispatchedTo', label: 'Dispatched To' },
        {
            key: 'createdAt',
            label: 'Dispatched Date',
            formatter: (createdAt) => moment(createdAt).format('YYYY-DD-MM')
        },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="ICT Asset Issuance Form"
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
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">ICT Asset Issuance</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">ICT Issuance</Link></li>
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
                                            <FNTable columns={tableColumns} data={requistions} onViewDetails={handleView} text="Issue To User" />
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

export default Issue