import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";
import * as XLSX from 'xlsx';

const Activity = () => {
    const [loading, setLoading] = useState(false);
    const [activityName, setActivityName] = useState("");
    const [requested_by, setRequestedBy] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [rows, setRows] = useState([]);
    const [dept, setDept] = useState("");
    const [amt, setAmt] = useState("");
    const [funder, setFunder] = useState("");
    const [vocherno, setVocherNo] = useState("");
    const [duplicates, setDuplicates] = useState([]);

    const token = localStorage.getItem('token');

    const loadFlagged = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/duplicates`);
            console.log(res)
            setDuplicates(res?.data);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const history = useHistory();

    const validatePhoneNumber = (phone) => {
        return phone.startsWith('0');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                if (workbook.SheetNames.length === 0) {
                    toast.error("The uploaded file does not contain any sheets.");
                    return;
                }

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const participants = XLSX.utils.sheet_to_json(worksheet);

                if (!Array.isArray(participants) || participants.length === 0) {
                    toast.error("No data found in the uploaded Excel file.");
                    return;
                }

                // Process each participant and check against duplicates list
                const formattedRows = participants.map((row, index) => {
                    // Find duplicate entry based on phone number
                    const duplicateEntry = duplicates.find(dup => dup.phone === row.phone);

                    // Flag users if they exist in duplicates and have days >= 150
                    const isFlagged = duplicateEntry ? parseInt(duplicateEntry.days, 10) >= 150 : false;

                    // Validate phone numbers
                    if (!validatePhoneNumber(row.phone || "")) {
                        throw new Error(`Invalid phone number format. Phone numbers must start with '0'.`);
                    }

                    return {
                        id: index + 1,
                        name: row.name || '',
                        title: row.title || '',
                        phone: row.phone || '',
                        amount: row.amount || '',
                        days: row.days || '',
                        isFlagged: isFlagged,
                    };
                });

                // Count flagged users and show warning toast
                const flaggedCount = formattedRows.filter(row => row.isFlagged).length;

                if (flaggedCount > 0) {
                    toast.warn(`${flaggedCount} participants highlighted in red have days more than 150 Days.`);
                }

                setRows(formattedRows);
                // toast.success("File uploaded successfully.");
            } catch (err) {
                toast.error(err.message || "Error processing the uploaded file. Please ensure it's a valid Excel file.");
                console.error("Error processing file:", err);
            }
        };

        reader.onerror = () => {
            toast.error("File reading failed.");
        };

        reader.readAsArrayBuffer(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            activityName,
            dept,
            invoiceDate,
            amt,
            funder,
            requested_by,
            vocherno,
            rows: rows.map(row => ({
                name: row.name,
                title: row.title,
                phone: row.phone,
                amount: row.amount,
                days: row.days,
            }))
        };

        try {
            await API.post("/activity", data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLoading(false);
            history.push('/activities/listing');
            toast.success(`Activity and Participants List Added Successfully`);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Error uploading Activity and Participants List");
        }
    };

    useEffect(() => {
        loadFlagged();
    }, []);

    useEffect(() => {
        setRows([{ id: 1, name: '', title: '', phone: '', amount: '', days: '' }]);
    }, []);

    console.log("Flagged Users", rows)

    return (
        <Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="d-sm-flex align-items-center justify-content-between mb-3">
                        <h4 className="mb-sm-0 font-size-18">Add Activity and Participants</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><Link to="/activities/listing">Back To Activities</Link></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label className="form-label">Activity Name</label>
                                <input type="text" className="form-control"
                                    placeholder="Enter Activity Name"
                                    value={activityName}
                                    onChange={(e) => setActivityName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label className="form-label">Requested By</label>
                                <input type="text" className="form-control"
                                    placeholder="Enter Requested By"
                                    value={requested_by}
                                    onChange={(e) => setRequestedBy(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <label className="form-label">Requesting Department / Division</label>
                                <select className="form-select" value={dept}
                                    onChange={(e) => setDept(e.target.value)}>
                                    <option>Select User Department</option>
                                    <option>Health Infrastructure</option>
                                    <option>Health Promotion</option>
                                    <option>AIDS Control Programme</option>
                                    <option>Malaria Programme</option>
                                    <option>ICT Unit</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="mb-3">
                                <label className="form-label">Total Requisition Amount</label>
<NumberFormat
                                    className="form-control"
                                    placeholder="Enter Amount"
                                    value={amt}
                                    thousandSeparator={true}
                                    onValueChange={(values) => setAmt(values.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="mb-3">
                                <label className="form-label">Source of Funding</label>
                                <select className="form-select" value={funder}
                                    onChange={(e) => setFunder(e.target.value)}>
                                    <option>Select Source of Funding</option>
                                    <option>GOU</option>
                                    <option>GF-HIV</option>
                                    <option>GF-COVID</option>
                                    <option>GF-MALARIA</option>
                                    <option>GF-TB</option>
                                    <option>RCGH</option>
                                    <option>KOFIH</option>
                                    <option>UCREPP</option>
                                    <option>GAVI</option>
                                    <option>ISHSP</option>
                                    <option>CDC</option>
                                    <option>WHO</option>
                                    <option>UNICEF</option>
                                    <option>UNFPA</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="mb-3">
                                <label className="form-label">Invoice Date</label>
                                <input type="date" className="form-control"
                                    placeholder="Enter Start Date"
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="mb-3">
                                <label className="form-label">Vocher Number</label>
                                <input type="text" className="form-control"
                                    placeholder="Enter Vocher Number"
                                    value={vocherno}
                                    onChange={(e) => setVocherNo(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        <input type="file" accept=".xlsx, .xls" id="fileUpload" onChange={handleFileUpload} style={{ display: 'none' }} />
                        <label htmlFor="fileUpload" className="btn btn-sm btn-soft-primary" style={{ cursor: 'pointer' }}>
                            Upload Participants List
                        </label>
                    </div>
                    {rows.filter(row => row.isFlagged).length > 0 && (
                        <div className="alert alert-danger mt-3">
                            {rows.filter(row => row.isFlagged).length} participants highlighted in red have days more than 150 Days.
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Phone Number</th>
                                    <th>Amount</th>
                                    <th>Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            backgroundColor: row.isFlagged ? 'red' : 'transparent',
                                            color: row.isFlagged ? 'white' : 'black'
                                        }}
                                        >{row.name}</td>
                                        <td style={{
                                            backgroundColor: row.isFlagged ? 'red' : 'transparent',
                                            color: row.isFlagged ? 'white' : 'black'
                                        }}>{row.title}</td>
                                        <td style={{
                                            backgroundColor: row.isFlagged ? 'red' : 'transparent',
                                            color: row.isFlagged ? 'white' : 'black'
                                        }}>{row.phone}</td>
                                        <td style={{
                                            backgroundColor: row.isFlagged ? 'red' : 'transparent',
                                            color: row.isFlagged ? 'white' : 'black'
                                        }}>
                                            <NumberFormat
                                                value={row.amount}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                            />
                                        </td>
                                        <td style={{
                                            backgroundColor: row.isFlagged ? 'red' : 'transparent',
                                            color: row.isFlagged ? 'white' : 'black'
                                        }}>{row.days}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="float-end">
                        <button onClick={handleSubmit} className="btn btn-primary w-md waves-effect waves-light">
                            {loading ? <FNSpinner /> : "Add Activity Details"}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Activity;