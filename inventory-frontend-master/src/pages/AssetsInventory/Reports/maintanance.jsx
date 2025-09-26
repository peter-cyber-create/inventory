import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';
import DownloadExcel from "../../../components/FNDownload";

const Maintenance = ({ id }) => {
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState([]);

    const loadMaintenance = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/maintenance`);
            setMaintenance(res.data.maintenance);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaintenance();
    }, []);

    const tableColumns = [
        { key: 'taskName', label: 'Task Name' },
        { key: 'servicedOn', label: 'Serviced On' },
        { key: 'servicedBy', label: 'Serviced By' },
        { key: 'nextService', label: 'Next Service Date' },

    ];
    return (

        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Preventive Maintenance Report</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/assets">Preventive Maintenance</Link></li>
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
                                                        <a onClick={() => DownloadExcel(maintenance, "Maintenance Report")} class="btn btn-primary waves-effect waves-light me-1"><i class="bx bx-download"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns} data={maintenance} />
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

export default Maintenance