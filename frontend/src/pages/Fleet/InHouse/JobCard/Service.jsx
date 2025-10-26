import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
import API from '../../../../helpers/api';

const Service = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [numberPlate, setNumberPlate] = useState('');
    const [description, setDescription] = useState('');
    const [spareParts, setSpareParts] = useState([]);
    const [rows, setRows] = useState([{ id: Date.now(), partId: '', partname: '', partno: '', category: '', qtyAvailable: '', qtyUsed: '', measure: '' }]);

    const history = useHistory();
    const { id } = match.params;

    const loadVehicle = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/v/vehicle/${id}`);
            setNumberPlate(res?.data.vehicle.licensePlate)
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const loadSpareParts = async () => {
        setLoading(true);
        try {
            const res = await API.get('/v/sparepart');
            setSpareParts(res?.data.sparepart || []);
        } catch (error) {
            console.log('Error loading spare parts:', error);
        } finally {
            setLoading(false);
        }
    };

    const addRow = () => {
        const newRow = {
            id: Date.now(),  // unique id for the row
            partname: '',
            partno: '',
            category: '',
            qty: '',
            qtyUsed: '',
            measure: '',
            partId: ''
        };
        setRows([...rows, newRow]);
    };

    const handleInputChange = (rowId, key, value) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                const updatedRow = { ...row, [key]: value };

                if (key === 'partno') {
                    const selectedPart = spareParts.find(part => part.id === parseInt(value, 10));
                    if (selectedPart) {
                        updatedRow.partId = selectedPart.id;
                        updatedRow.partno = selectedPart.partno;
                        updatedRow.partname = selectedPart.partname;
                        updatedRow.category = selectedPart.vsparecategory?.name || 'N/A';
                        updatedRow.qty = selectedPart.qty || '0';
                        updatedRow.measure = selectedPart.measure;
                    } else {
                        // Clear fields if no valid part selected
                        updatedRow.partname = '';
                        updatedRow.category = '';
                        updatedRow.qtyAvailable = '';
                    }
                }

                return updatedRow;
            }
            return row;
        });

        setRows(updatedRows);
    };

    const deleteRow = (rowId) => {
        const updatedRows = rows.filter(row => row.id !== rowId);
        setRows(updatedRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const requestData = {
            description,
            numberPlate,
            vehicleId: id,
            rows: rows.map(row => ({
                partId: row.partId,
                partno: row.partno,
                category: row.category,
                partname: row.partname,
                qtyUsed: row.qtyUsed,
                measure: row.measure
            }))
        };

        console.log("Data::", requestData)

        try {
            await API.post('/v/jobcard', requestData);
            toast.success('Job Card has been added successfully');
            history.push('/fleet/receiving');
        } catch (error) {
            console.log('Error while adding job card:', error);
            toast.error('Error while adding Job Card');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpareParts();
        loadVehicle();
    }, []);

    return (
        <Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-b d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0 font-size-18">Vehicle Number Plate : {numberPlate} </h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><Link to="/fleet/receiving">Back</Link></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label htmlFor="service-description" className="form-label">Service / Repair Description</label>
                                <textarea
                                    id="service-description"
                                    className="form-control"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="table-responsive">
                                <button onClick={addRow} className="btn btn-primary mt-2 mb-2">Add Spare Parts Used</button>
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Spare Part No</th>
                                            <th>Spare Name</th>
                                            <th>Spare Category</th>
                                            <th>Quantity Available</th>
                                            <th>Unit Measure</th>
                                            <th>Quantity Used</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row.partId}
                                                        onChange={(e) => handleInputChange(row.id, 'partno', e.target.value)}
                                                    >
                                                        <option value="">Select Spare PartNo</option>
                                                        {spareParts.map((part) => (
                                                            <option key={part.id} value={part.id}>
                                                                {part.partno}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.partname}
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.category}
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.qty}
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.measure}
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter Quantity Used"
                                                        value={row.qtyUsed}
                                                        onChange={(e) => handleInputChange(row.id, 'qtyUsed', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => deleteRow(row.id)}
                                                        type="button"
                                                        className="btn btn-danger mt-3 mt-lg-0"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="actions clearfix">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                style={{ cursor: 'pointer' }}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Garage Job Card'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Service;
