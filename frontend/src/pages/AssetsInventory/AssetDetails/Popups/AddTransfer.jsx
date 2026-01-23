import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner'

const AddTransfer = ({ close, id, owner}) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState("");
    const [department, setDept] = useState("");
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [officeNo, setOfficeNo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            user, department, title, reason, officeNo, assetId: id, 
            previousUser : owner.issuedTo, 
            previousDept : owner.department, 
            previousTitle : owner.title
        }

        try {
            const response = await API.post("/transfers", data);
            setLoading(false);
            close();
            toast.success('Asset Ownership Changed Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error While Changin Asset Ownership");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">New User</label>
                            <input type="text" class="form-control" placeholder="Enter New User"
                                value={user}
                                onChange={(e) => setUser(e.target.value)} />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">New Department</label>
                            <input type="text" class="form-control" placeholder="Enter New Department"
                                value={department}
                                onChange={(e) => setDept(e.target.value)} />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">New User Title</label>
                            <input type="text" class="form-control" placeholder="Enter New User Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">New Office Number</label>
                            <input type="text" class="form-control" placeholder="Enter New Office Number"
                                value={officeNo}
                                onChange={(e) => setOfficeNo(e.target.value)} />
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Transfer Reason</label>
                            <textarea class="form-control" placeholder="Enter Tranfer Reasons" rows="3"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="div mt-3">
                <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Change Asset Ownership"}</button>
                <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

export default AddTransfer