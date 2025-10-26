import React from "react";

const Step2 = ({ rows, setRows }) => {

    const addRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            { id: prevRows.length + 1, asset: '', category: '', serialNo: '', engravedNo: '', model: '', funding: ''},
        ]);
    };

    const deleteRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    return (
        <div class="table-responsive">
            <button onClick={addRow} class="btn btn-primary mt-2 mb-2">Add Row</button>
            <table class="table mb-0">
                <thead class="table-light">
                    <tr>
                        <th>ICT Device</th>
                        <th>Category</th>
                        <th>Model</th>
                        <th>Serial No</th>
                        <th>Engraved No</th>
                        <th>Funding</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <input type="text" class="form-control" placeholder="Enter ICT Device"
                                    value={row.asset}
                                    onChange={(e) => handleInputChange(row.id, 'asset', e.target.value)}
                                />
                            </td>
                            <td>
                                <select class="form-select" value={row.model}
                                    onChange={(e) => handleInputChange(row.id, 'model', e.target.value)}>
                                    <option value="">Select Category</option>
                                    <option value="Desktop">Desktop</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Printer">Printer</option>
                                    <option value="TV Screen">TV Screen</option>
                                </select>
                            </td>
                            <td>
                                <select class="form-select" value={row.model}
                                    onChange={(e) => handleInputChange(row.id, 'model', e.target.value)}>
                                    <option value="">Select Model</option>
                                    <option value="Dell">Dell</option>
                                    <option value="HP">HP</option>
                                    <option value="Lanovo">Lanovo</option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control" placeholder="Enter Serial no"
                                    value={row.serialNo}
                                    onChange={(e) => handleInputChange(row.id, 'serialNo', e.target.value)}
                                />
                            </td>
                            <td>
                                <input type="text" class="form-control" placeholder="Enter Engraved No"
                                    value={row.engravedNo}
                                    onChange={(e) => handleInputChange(row.id, 'engravedNo', e.target.value)}
                                />
                            </td>
                            <td>
                                <select class="form-select" value={row.funding}
                                    onChange={(e) => handleInputChange(row.id, 'funding', e.target.value)}>
                                    <option value="">Select Funding</option>
                                    <option value="GOU">GOU</option>
                                    <option value="URMCHIP">URMCHIP</option>
                                    <option value="UCREPP">UCREPP</option>
                                    <option value="GLOBAL FUND">GLOBAL FUND</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => deleteRow(row.id)} type="button" class="btn btn-success mt-3 mt-lg-0">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Step2