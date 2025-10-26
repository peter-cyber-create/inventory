import React, { useState, useEffect, Fragment } from 'react'
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner'
import FNTable from '../../../../components/FNTable';

const JobCard = () => {
    const [jobcards, setJobCards] = useState([]);
    const [loading, setLoading] = useState([]);

    const history = useHistory();

    const loadJobCards = async () => {
        setLoading(true);
        try {
            const res = await API.get("/v/jobcard");

            const formattedJobs = res.data.job.map(job => ({
                ...job,
                createdAt: moment(job.createdAt).format('YYYY-MM-DD')
                // status: <span class="badge bg-warning">{ticket.status}</span>
            }));
            console.log(res)
            setJobCards(formattedJobs);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleView = (id) => {
        history.push(`/fleet/jobcard/${id}`);
    };

    useEffect(() => {
        loadJobCards();
    }, []);

    const tableColumns = [
        { key: 'id', label: 'Job Card' },
        { key: 'numberPlate', label: 'Number Plate' },
        { key: 'description', label: 'Description' },
        { key: 'createdAt', label: 'Service Date' },
    ];

    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Garage Car Job Card</h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/jobcards">Vehicles</Link></li>
                                <li class="breadcrumb-item active">Job Card</li>
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
                                                    {/* <div class="text-sm-end">
                                                        <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add Garage Job Card</button>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <FNTable columns={tableColumns}
                                                data={jobcards}
                                                onViewDetails={handleView} text="View Parts Used" />
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

export default JobCard