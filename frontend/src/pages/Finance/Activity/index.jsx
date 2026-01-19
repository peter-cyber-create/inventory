/**
 * Ministry of Health Uganda - Finance Activity Form
 * Official activity and participants registration - Professional, institutional design
 */
import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, Alert, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import API from '../../../helpers/api';
import FNSpinner from '../../../components/FNSpinner';
import PageLayout from '../../../components/Layout/PageLayout';
import InstitutionalForm from '../../../components/Common/InstitutionalForm';
import '../../../theme/moh-institutional-theme.css';

const Activity = () => {
    const [loading, setLoading] = useState(false);
    const [activityName, setActivityName] = useState("");
    const [requestedBy, setRequestedBy] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [rows, setRows] = useState([]);
    const [dept, setDept] = useState("");
    const [amt, setAmt] = useState("");
    const [funder, setFunder] = useState("");
    const [vocherno, setVocherNo] = useState("");
    const [duplicates, setDuplicates] = useState([]);

    const token = localStorage.getItem('token');
    const history = useHistory();

    const loadFlagged = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/activity/duplicates`);
            setDuplicates(res?.data || []);
        } catch (error) {
            console.error("Error loading flagged participants", error);
        } finally {
            setLoading(false);
        }
    };

    const validatePhoneNumber = (phone) => {
        return phone.startsWith('0');
    };

    const handleFileUpload = (file) => {
        if (!file) {
            toast.error("No file selected.");
            return false;
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

                const formattedRows = participants.map((row, index) => {
                    const duplicateEntry = duplicates.find(dup => dup.phone === row.phone);
                    const isFlagged = duplicateEntry ? parseInt(duplicateEntry.days, 10) >= 150 : false;

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
                        isFlagged
                    };
                });

                const flaggedCount = formattedRows.filter(row => row.isFlagged).length;
                if (flaggedCount > 0) {
                    toast.warn(`${flaggedCount} participants highlighted in red have days more than 150 Days.`);
                }

                setRows(formattedRows);
            } catch (err) {
                toast.error(err.message || "Error processing the uploaded file. Please ensure it's a valid Excel file.");
                console.error("Error processing file:", err);
            }
        };

        reader.onerror = () => {
            toast.error("File reading failed.");
        };

        reader.readAsArrayBuffer(file);
        return false; // Prevent auto upload
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
            requested_by: requestedBy,
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

            history.push('/activities/listing');
            toast.success(`Activity and Participants List Added Successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error uploading Activity and Participants List");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFlagged();
    }, []);

    useEffect(() => {
        setRows([{ id: 1, name: '', title: '', phone: '', amount: '', days: '' }]);
    }, []);

    const sections = [
        {
            title: 'Activity Information',
            description: 'Provide basic details about the activity. This information will be used for reporting and accountability.',
            fields: (
                <>
                    <div className="form-group">
                        <label className="form-label required">Activity Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Activity Name"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Requested By</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Requested By"
                            value={requestedBy}
                            onChange={(e) => setRequestedBy(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Requesting Department / Division</label>
                        <select
                            className="form-control"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            required
                        >
                            <option value="">Select User Department</option>
                            <option>Health Infrastructure</option>
                            <option>Health Promotion</option>
                            <option>AIDS Control Programme</option>
                            <option>Malaria Programme</option>
                            <option>ICT Unit</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Invoice Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Voucher Number</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Voucher Number"
                            value={vocherno}
                            onChange={(e) => setVocherNo(e.target.value)}
                        />
                    </div>
                </>
            )
        },
        {
            title: 'Funding Information',
            description: 'Capture the financial details for this activity. Amounts will be used in financial reports.',
            fields: (
                <>
                    <div className="form-group">
                        <label className="form-label required">Total Requisition Amount</label>
                        <NumberFormat
                            className="form-control"
                            placeholder="Enter Amount"
                            value={amt}
                            thousandSeparator={true}
                            onValueChange={(values) => setAmt(values.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label required">Source of Funding</label>
                        <select
                            className="form-control"
                            value={funder}
                            onChange={(e) => setFunder(e.target.value)}
                            required
                        >
                            <option value="">Select Source of Funding</option>
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
                </>
            )
        },
        {
            title: 'Participants List',
            description: 'Upload the list of participants for this activity. The system will automatically flag potential issues.',
            fields: (
                <>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label required">Upload Participant List (Excel)</label>
                        <Upload.Dragger
                            name="file"
                            multiple={false}
                            beforeUpload={handleFileUpload}
                            accept=".xlsx, .xls"
                            showUploadList={false}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined style={{ fontSize: '48px', color: '#006747' }} />
                            </p>
                            <p className="ant-upload-text" style={{ color: '#1A1A1A', fontWeight: 500 }}>
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint" style={{ color: '#5A6872' }}>
                                Supports .xlsx, .xls formats. Required columns: name, title, phone, amount, days.
                            </p>
                        </Upload.Dragger>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
                            Participants already in the system with more than 150 days will be highlighted in red.
                        </p>
                    </div>
                    {loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 'var(--space-4)' }}>
                            <FNSpinner />
                        </div>
                    )}
                    {rows.filter(row => row.isFlagged).length > 0 && (
                        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-4)' }}>
                            <Alert
                                message={`${rows.filter(row => row.isFlagged).length} participants highlighted in red have days more than 150 Days.`}
                                type="warning"
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                        </div>
                    )}
                    {rows.length > 0 && (
                        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-4)' }}>
                            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: '#006747' }}>
                                Participants Preview
                            </h4>
                            <Table
                                dataSource={rows}
                                columns={[
                                    {
                                        title: '#',
                                        dataIndex: 'id',
                                        key: 'id',
                                        width: 50,
                                        render: (_, __, index) => index + 1
                                    },
                                    {
                                        title: 'Name',
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (text, record) => (
                                            <span style={{ 
                                                backgroundColor: record.isFlagged ? '#FFEBEE' : 'transparent',
                                                color: record.isFlagged ? '#E53935' : '#1A1A1A',
                                                padding: '2px 4px',
                                                borderRadius: '2px'
                                            }}>
                                                {text}
                                            </span>
                                        )
                                    },
                                    {
                                        title: 'Title',
                                        dataIndex: 'title',
                                        key: 'title',
                                        render: (text, record) => (
                                            <span style={{ 
                                                backgroundColor: record.isFlagged ? '#FFEBEE' : 'transparent',
                                                color: record.isFlagged ? '#E53935' : '#1A1A1A',
                                                padding: '2px 4px',
                                                borderRadius: '2px'
                                            }}>
                                                {text}
                                            </span>
                                        )
                                    },
                                    {
                                        title: 'Phone',
                                        dataIndex: 'phone',
                                        key: 'phone',
                                        render: (text, record) => (
                                            <span style={{ 
                                                backgroundColor: record.isFlagged ? '#FFEBEE' : 'transparent',
                                                color: record.isFlagged ? '#E53935' : '#1A1A1A',
                                                padding: '2px 4px',
                                                borderRadius: '2px'
                                            }}>
                                                {text}
                                            </span>
                                        )
                                    },
                                    {
                                        title: 'Amount',
                                        dataIndex: 'amount',
                                        key: 'amount',
                                        render: (text, record) => (
                                            <span style={{ 
                                                backgroundColor: record.isFlagged ? '#FFEBEE' : 'transparent',
                                                color: record.isFlagged ? '#E53935' : '#1A1A1A',
                                                padding: '2px 4px',
                                                borderRadius: '2px'
                                            }}>
                                                <NumberFormat
                                                    value={text}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix="UGX "
                                                />
                                            </span>
                                        )
                                    },
                                    {
                                        title: 'Days',
                                        dataIndex: 'days',
                                        key: 'days',
                                        render: (text, record) => (
                                            <span style={{ 
                                                backgroundColor: record.isFlagged ? '#FFEBEE' : 'transparent',
                                                color: record.isFlagged ? '#E53935' : '#1A1A1A',
                                                padding: '2px 4px',
                                                borderRadius: '2px',
                                                fontWeight: record.isFlagged ? 600 : 400
                                            }}>
                                                {text}
                                            </span>
                                        )
                                    },
                                ]}
                                pagination={false}
                                rowKey="id"
                                size="middle"
                                bordered
                                className="institutional-table"
                                style={{ marginTop: '16px' }}
                            />
                        </div>
                    )}
                </>
            )
        }
    ];

    return (
        <PageLayout
            title="Add New Financial Activity"
            subtitle="Record details of financial activities and their participants"
        >
            <InstitutionalForm
                title="Activity & Participants"
                sections={sections}
                onSubmit={handleSubmit}
                submitLabel="Submit Activity & Participants"
                cancelLabel="Cancel"
                onCancel={() => history.push('/activities/listing')}
                loading={loading}
            />
        </PageLayout>
    );
};

export default Activity;