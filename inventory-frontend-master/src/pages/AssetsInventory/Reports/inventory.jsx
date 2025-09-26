/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner';
import FNTable from '../../../components/FNTable';
import DownloadExcel from "../../../components/FNDownload";
import Filters from './Filters';


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
        { key: 'category.name', label: 'Category' },
        { key: 'brand.name', label: 'Brand' },
        { key: 'model.name', label: 'Model' },
        { key: 'serialNo', label: 'Serial No' },
        { key: 'engravedNo', label: 'Engraved No' },
        { key: 'funder', label: 'Funder' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">ICT Assets Inventory Report</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">ICT Inventory</Link></li>
                                <li class="breadcrumb-item active">Listing</li>
                            </ol>
                        </div>
                    </div>
                </div>
                {/* <Filters /> */}
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
                                                        <a onClick={() => DownloadExcel(inventory, "Inventory Report")} class="btn btn-primary waves-effect waves-light me-1"><i class="bx bx-download"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={inventory} onViewDetails={handleView} text="" />
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