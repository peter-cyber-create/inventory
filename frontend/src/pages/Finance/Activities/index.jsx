import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import FSpinner from '../../../components/FNSpinner'
import FNTable from './FNTable'

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 50;

    const history = useHistory();
    const token = localStorage.getItem('token');

    const loadActivities = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/my?page=${currentPage}&limit=${limit}`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setActivities(res?.data.activities);
            setTotalPages(res?.data.totalPages);
            setTotalRecords(res?.data.totalRecords);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const viewDetails = (id) => {
        history.push(`/activities/participants/${id}`);
    };

    const handleEdit = (id) => {
        history.push(`/activities/update/${id}`);
    };

    const editSupply = (id) => {
        history.push(`/activities/edit/${id}`);
    };

    useEffect(() => {
        loadActivities();
    }, [currentPage]);

    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page d-sm-flex align-items-center justify-content-between mb-3">
                        <h4 class="mb-sm-0 font-size-18">MOH Field Activities Tracker</h4>
                        <div class="page-title-right">
                            {/* <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/activities">Vehicles</Link></li>
                                <li class="breadcrumb-item active">Activities Invoices</li>
                            </ol> */}
                        </div>
                    </div>
                </div>
            </div>
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
                                                <Link to='/activities/add' type="submit" class="btn btn-primary waves-effect waves-light" >Add New Activity</Link>
                                            </div>
                                        </div>
                                    </div>
                                    {loading ? <FSpinner /> :
                                        <FNTable
                                            data={activities}
                                            onViewDetails={viewDetails}
                                            handleEdit={handleEdit}
                                            handleUpdate={editSupply}
                                        />
                                    }
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info" role="status" aria-live="polite">
                                                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} Records
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-7">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <ul className="pagination">
                                                    <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <a onClick={handlePrevious} className="page-link">Previous</a>
                                                    </li>
                                                    {[...Array(totalPages)].map((_, index) => (
                                                        <li key={index} className={`paginate_button page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                            <a onClick={() => setCurrentPage(index + 1)} className="page-link">{index + 1}</a>
                                                        </li>
                                                    ))}
                                                    <li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <a onClick={handleNext} className="page-link">Next</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Activities