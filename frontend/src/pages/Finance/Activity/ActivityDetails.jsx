import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { Fragment, useState, useEffect } from "react";
import moment from 'moment';
import { toast } from "react-toastify";
import API from "../../../helpers/api";

const ActivityDetails = ({ match }) => {

    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState({});
    const [participants, setParticipants] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { id } = match.params;

    const loadActivity = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/${id}`);
            setActivity(res?.data.activity);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const loadParticipants = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/participants/${id}`);
            console.log(res)
            setParticipants(res?.data.participants);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            const fileType = file.name.toLowerCase().split('.').pop();
            if (!['pdf', 'doc', 'docx'].includes(fileType)) {
                toast.error('Only PDF and Word documents are allowed');
                event.target.value = null; // Clear the input
                return;
            }
            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                event.target.value = null; // Clear the input
                return;
            }
            setSelectedFile(file);
            setUploadStatus('');
        }
    };


    const handleUpload = async () => {
        if (!selectedFile) {
            toast.warning('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('activityReport', selectedFile);
        formData.append('id', match.params.id);

        try {
            setIsUploading(true);
            const response = await API.post('/activity/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Report uploaded successfully');
            setSelectedFile(null);
            loadActivity();

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload report';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        loadParticipants();
    }, []);

    useEffect(() => {
        loadActivity();
    }, []);
    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page d-sm-flex align-items-center justify-content-between mb-3">
                        <h4 class="mb-sm-0 font-size-18">Activity Participants List</h4>
                        <div class="page-title-right">
                            {/* <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/activities">Vehicles</Link></li>
                                <li class="breadcrumb-item active">Activities Invoices</li>
                            </ol> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="mb-3"> Activity Name : {activity.activityName}</h3>
                            <section className='d-flex flex-row justify-content-between'>
                                <div>
                                    <h5>Source of Funding: {activity.funder}</h5>
                                    <h5>  Requesting Department: {activity.dept}</h5>
                                </div>
                                <div>
                                    <h5> Invoice Date: {moment(activity.invoiceDate).format('YYYY-MM-DD')}</h5>
                                    {/* <h5>Activity End Date: {moment(activity.endDate).format('YYYY-MM-DD')}</h5> */}
                                </div>
                                <div>
                                    <h5> Vo: {activity.vocherno}</h5>
                                    <h5>Requisitioned Amount:
<NumberFormat
                                            value={activity.amt}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </h5>
                                </div>
                                <div>
                                    <h5> Requisition Date: {moment(activity.createdAt).format('YYYY-MM-DD')}</h5>
                                    <h5>Approved Date: {moment(activity.updatedAt).format('YYYY-MM-DD')}</h5>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <section className="mt-4">
                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered border-secondary table-sm">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Name</th>
                                                <th>Title</th>
                                                <th>Phone Number</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Days</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participants &&
                                                participants.map((p) => (
                                                    <tr key={p.id}>
                                                        <td>{p.name}</td>
                                                        <td>{p.title}</td>
                                                        <td>{p.phone}</td>
                                                        <td>
                                                            <NumberFormat
                                                                value={p.amount}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${activity.status === 'closed' ? 'success' : 'warning'}`}>
                                                                {activity.status || 'open'}
                                                            </span>
                                                        </td>
                                                        <td>{p.days}</td>
                                                    </tr>
                                                ))}
                                            {activity.reportPath && (
                                                <tr>
                                                    <th scope="row">Activity Report:</th>
                                                    <td>
                                                        <a
                                                            href={`http://localhost:9000/uploads/reports/${activity.reportPath.split('/').pop()}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-info"
                                                        >
                                                            View Report
                                                        </a>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </div>
                    {activity.status !== 'closed' && (
                        <div className="card mt-4">
                            <div className="card-body">
                                <h5 className="card-title">Upload Activity Report</h5>
                                <div className="mb-3">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                        disabled={isUploading}
                                    />
                                    <small className="text-muted">
                                        Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                                    </small>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Uploading...
                                        </>
                                    ) : 'Upload Report'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default ActivityDetails