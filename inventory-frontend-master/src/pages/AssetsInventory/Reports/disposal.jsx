import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';
import DownloadExcel from "../../../components/FNDownload";

const Disposal = ({ id }) => {
    const [disposal, setDisposal] = useState([]);
    const [loading, setLoading] = useState([]);

    const loadDisposal = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/disposal`);
            setDisposal(res.data.disposal);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDisposal();
    }, []);

    const tableColumns = [
        { key: 'disposalDate', label: 'Disposal Date' },
        { key: 'disposalMethod', label: 'Disposal Method' },
        { key: 'disposalCost', label: 'Disposal Cost' },
        { key: 'disposalReason', label: 'Disposal Reason' }
    ];
    return (

        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Asset Disposal Report</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Asset Disposal</Link></li>
                                <li class="breadcrumb-item active">Report</li>
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
                                                        <a onClick={() => DownloadExcel(disposal, "Disposal Assets Report")} class="btn btn-primary waves-effect waves-light me-1"><i class="bx bx-download"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={disposal} />
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

export default Disposal