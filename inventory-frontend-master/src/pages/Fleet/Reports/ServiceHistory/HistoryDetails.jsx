import React, { useState, useEffect } from "react";
import moment from 'moment';
import API from "../../../../helpers/api";

const HistoryDetails = ({ id }) => {
    const [vehicle, setVehicle] = useState({});
    const [parts, setParts] = useState([]);
    const [jobcards, setJobCards] = useState([]);
    const [loading, setLoading] = useState(false)

    const getVehicle = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/vehicle/${id}`);
            setLoading(false);
            setVehicle(res.data.asset);
        } catch (error) {
            setLoading(false);
        }
    };

    const getPartsUsed = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/jobcards/parts`);
            setParts(res.data.job);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const loadJobCards = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/jobcards/vehicle/${id}`);

            const formattedJobs = res.data.job.map(job => ({
                ...job,
                createdAt: moment(job.createdAt).format('YYYY-MM-DD'),
                // id: job.id.substring(0, 8)
                // status: <span class="badge bg-warning">{ticket.status}</span>
            }));
            // console.log("Jobcards ===>", res)
            setJobCards(formattedJobs);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getVehicle();
        loadJobCards();
    }, [id]);

    useEffect(() => {
        getPartsUsed();
    }, []);

    return (
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="invoice-title">
                                    <h4 class="float-end font-size-16">Vehicle Number Plate # <span class="badge bg-warning">{vehicle && vehicle.licensePlate}</span></h4>
                                    <div class="auth-logo mb-4">
                                        <h4>Ministry of Health Vehicle Service History Report</h4>
                                        {/* <img src="assets/images/logo-dark.png" alt="logo" class="auth-logo-dark" height="20" />
                                        <img src="assets/images/logo-light.png" alt="logo" class="auth-logo-light" height="20" /> */}
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-4">
                                        <address>
                                            <strong>Vehicle Number Plate:</strong> {vehicle && vehicle.licensePlate}<br />
                                            Chassis Number: {vehicle && vehicle.chassisNo}<br />
                                            Engine Number: {vehicle && vehicle.engineNo}<br />
                                            Mileage: {vehicle && vehicle.mileage}<br />
                                        </address>
                                    </div>
                                    <div class="col-sm-4">
                                        <address>
                                            <strong>Category:</strong> {vehicle && vehicle.category && vehicle.category.categoryName}<br />
                                            Model: {vehicle && vehicle.model && vehicle.model.modelName}<br />
                                            Type: {vehicle && vehicle.category && vehicle.category.categoryName}<br />
                                            Brand: {vehicle && vehicle.brand && vehicle.brand.brandName}<br />
                                        </address>
                                    </div>
                                    <div class="col-sm-4 text-sm-end">
                                        <address class="mt-2 mt-sm-0">
                                            <strong>Engine Type:</strong>{vehicle && vehicle.engineType}<br />
                                            Transmission: {vehicle && vehicle.transmission}<br />
                                            Assigned To: <br />
                                            Department: <br />
                                        </address>
                                    </div>
                                </div>
                                <div class="py-2 mt-3">
                                    <h3 class="font-size-15 fw-bold">Vehicle Service History Details</h3>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-nowrap">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '70px' }}>Service Date</th>
                                                <th style={{ width: '70px' }}>Job Card Number</th>
                                                <th style={{ width: '70px' }}>Service Description</th>
                                                <th style={{ width: '70px' }}>Serviced By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobcards &&
                                                jobcards.map((job) => (
                                                    <>
                                                        <tr>
                                                            <td style={{ backgroundColor: '#f2f2f2' }}>{job.createdAt}</td>
                                                            <td style={{ backgroundColor: '#f2f2f2' }}>{job.id}</td>
                                                            <td style={{ backgroundColor: '#f2f2f2' }}>{job.repair}</td>
                                                            <td style={{ backgroundColor: '#f2f2f2' }}>David Incharge</td>
                                                        </tr>
                                                        {parts.filter(part => part.jobCardId === job.id).map(part => (
                                                            <tr key={part.id}>
                                                                <td>{part.name}</td>
                                                                <td>{part.partno}</td>
                                                                <td>{part.specification}</td>
                                                                {/* <td>{part.qtyUsed}</td> */}
                                                            </tr>
                                                        ))}
                                                    </>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div class="d-print-none">
                                    <div class="float-end">
                                        <a href="javascript:window.print()" class="btn btn-success waves-effect waves-light me-1"><i class="fa fa-print"></i></a>
                                        <a href="javascript: void(0);" class="btn btn-primary w-md waves-effect waves-light">Send</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HistoryDetails