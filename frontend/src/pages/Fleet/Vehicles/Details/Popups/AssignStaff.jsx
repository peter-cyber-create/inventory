import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import FNSpinner from '../../../../../components/FNSpinner'

const AssignedStaff = ({ close, id, vehicle }) => {
    const [loading, setLoading] = useState(false);
    const [officer, setOfficer] = useState("");
    const [user_department, setUserDepartment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            officer,
            user_department
        };

        try {
            const response = await API.put(`/v/vehicle/${id}`, data);
            console.log(response)
            setLoading(false);
            close();
            window.location.reload()
            toast.success("Vehicle ReAssigned To Officer");
        } catch {
            setLoading(false);
            toast.error("Failure in ReAssigning Vehicle");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Current Officer</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="Driver Name"
                                value={vehicle.officer}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Current User Department</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="Driver Name"
                                value={vehicle.user_department}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">New Officer</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="New Officer Details"
                                value={officer}
                                onChange={(e) => setOfficer(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">New User Department</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="New User Department"
                                value={user_department}
                                onChange={(e) => setUserDepartment(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="div mt-3">
                    <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "ReAssign Officer"}</button>
                    <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AssignedStaff