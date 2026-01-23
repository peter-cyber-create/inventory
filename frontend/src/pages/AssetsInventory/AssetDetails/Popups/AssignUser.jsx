import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner'

const AssignUser = ({ close, id, refresh }) => {
    const [loading, setLoading] = useState(false);
    const [staffId, setStaffId] = useState("");
    const [issuedBy, setIssuedBy] = useState("");
    const [staff, setStaff] = useState([]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const res = await API.get("/staff");
            setStaff(res?.data?.staff || []);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStaff = (selectedOption) => {
        setStaffId(selectedOption?.value || "");
    };


    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const data = {
            issuedBy,
            staffId,
            assetId: id
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

    
    useEffect(() => {
        loadStaff();
    }, []);

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div class="col-lg-12">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Issued By</label>
                            <input type="text" class="form-control" placeholder="Enter New User"
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="mb-3">
                            <label className="form-label">Staff</label>
                            <Select
                                options={staff.map((dept) => ({
                                    value: dept.id,
                                    label: dept.name,
                                }))}
                                onChange={handleStaff}
                                placeholder="Select Staff"
                                isSearchable
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="div mt-3">
                <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Assign Asset"}</button>
                <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

export default AssignUser