import React, { useState, Fragment } from 'react'
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import LoadSpinner from "../../../components/FNSpinner";

const AddIssue = ({ id, assetId, serialNo, model, setModel, setSerialNo, close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [issuedBy, setIssuedBy] = useState("");
    const [issuedTo, setIssuedTo] = useState("");
    const [department, setDepartment] = useState("");
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const data = {
            serialNo,
            model,
            issuedBy,
            issuedTo,
            department,
            title,
            assetId
        }

        try {
            const res = await API.post(`/issue/ict`, data);
            console.log(res)
            toast.success('Asset Issued Successfully To User');
            close();
            refresh();
            setLoading(false)
        } catch (error) {
            setLoading(false);
            toast.error(`Asset Issue Failed`);
        }
    };

    return (
        <Fragment>
            <div className='card'>
                <div className='card-body'>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Serial Number</label>
                                <input type="text" class="form-control" id="kycfirstname-input" placeholder="Enter Serial Number"
                                    value={serialNo}
                                    onChange={(e) => setSerialNo(e.target.value)}
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kyclastname-input" class="form-label">Model</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Engraved Number"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Issued By</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Issued By"
                                    value={issuedBy}
                                    onChange={(e) => setIssuedBy(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Issued To</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Issued To"
                                    value={issuedTo}
                                    onChange={(e) => setIssuedTo(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Department / Division</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)} />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Employee Title</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Employee Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary waves-effect waves-light" type="submit" onClick={handleSubmit}>
                    {loading ? (
                        <LoadSpinner />
                    ) : (
                        'Issue ICT Asset'
                    )}
                </button>
            </div>
        </Fragment>
    )
}

export default AddIssue;