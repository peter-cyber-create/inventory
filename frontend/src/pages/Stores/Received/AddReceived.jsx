import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const AddReceived = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ deliveryDate: "", orderNo: "", invoiceNo: "", RefNo: "", NoteNo: "", supplier: "" });
    const [rows, setRows] = useState([{ id: 1, product: '', unit: '', qty: '', rate: '', invoiceValue: '' }]);

    const addRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            { id: prevRows.length + 1, product: '', unit: '', qty: '', rate: '', invoiceValue: '' },
        ]);
    };

    const deleteRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    // const handleInputChange = (id, field, value) => {
    //     setRows((prevRows) =>
    //         prevRows.map((row) =>
    //             row.id === id ? { ...row, [field]: value } : row
    //         )
    //     );
    // };

    const handleInputChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id === id) {
                    const updatedRow = { ...row, [field]: value };
                    if (field === 'qty' || field === 'rate') {
                        updatedRow.invoiceValue = (updatedRow.qty || 0) * (updatedRow.rate || 0);
                    }
                    return updatedRow;
                }
                return row;
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const requestData = {
            ...formData,
            rows: rows.map(row => ({
                product: row.product,
                unit: row.unit,
                qty: row.qty,
                rate: row.rate,
                invoiceValue: row.invoiceValue
            }))
        };

        try {
            const response = await API.post("/goods/received", requestData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('Goods Received Has Been Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Goods Received");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Delivery Date</label>
                                <input type="date" class="form-control" placeholder="Enter Product Name"
                                    value={formData.deliveryDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deliveryDate: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Prof. Ref No</label>
                                <input type="text" class="form-control" placeholder="Enter Prof. Ref No"
                                    value={formData.RefNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, RefNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Order No</label>
                                <input type="text" class="form-control" placeholder="Enter Order No"
                                    value={formData.orderNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, orderNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Invoice No</label>
                                <input type="text" class="form-control" placeholder="Enter Invoice No"
                                    value={formData.invoiceNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, invoiceNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Del. Note No</label>
                                <input type="text" class="form-control" placeholder="Enter Invoice No"
                                    value={formData.NoteNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, NoteNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Supplier</label>
                                <input type="text" class="form-control" placeholder="Enter Supplier"
                                    value={formData.supplier}
                                    onChange={(e) =>
                                        setFormData({ ...formData, supplier: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <button onClick={addRow} class="btn btn-primary mt-2 mb-2">Add Row</button>
                        <table class="table mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Description of Goods</th>
                                    <th>Unit Measure</th>
                                    <th>Qty Received</th>
                                    <th>Rate</th>
                                    <th>Invoice Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <input type="text" class="form-control" placeholder="Enter Description of Goods"
                                                value={row.product}
                                                onChange={(e) => handleInputChange(row.id, 'product', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" class="form-control" placeholder="Enter Unit Measure"
                                                value={row.unit}
                                                onChange={(e) => handleInputChange(row.id, 'unit', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" class="form-control" placeholder="Enter Qty Received"
                                                value={row.qty}
                                                onChange={(e) => handleInputChange(row.id, 'qty', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" class="form-control" placeholder="Enter Rate"
                                                value={row.rate}
                                                onChange={(e) => handleInputChange(row.id, 'rate', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" class="form-control" placeholder="Enter Invoice Value"
                                                value={row.invoiceValue}
                                                onChange={(e) => handleInputChange(row.id, 'invoiceValue', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => deleteRow(row.id)} type="button" class="btn btn-success mt-3 mt-lg-0">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Generate Goods Received Note"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddReceived