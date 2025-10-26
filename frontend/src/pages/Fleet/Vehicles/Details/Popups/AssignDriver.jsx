import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../../helpers/api";
import FNSpinner from '../../../../../components/FNSpinner'

const AssignDriver = ({ close, id, vehicle }) => {
    const [loading, setLoading] = useState(false);
    const [driver, setDriver] = useState("");
    const [contact, setContact] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            driver,
            contact
        };

        try {
            const response = await API.put(`/v/vehicle/${id}`, data);
            console.log(response)
            setLoading(false);
            close();
            window.location.reload()
            toast.success("Vehicle ReAssigned To New Driver");
        } catch {
            setLoading(false);
            toast.error("Failure in Assigning Vehicle");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Current Driver Name</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="Driver Name"
                                value={vehicle.driver}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">New Driver Names</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="New Driver Details"
                                value={driver}
                                onChange={(e) => setDriver(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">New Driver Contacts</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="New Driver Contacts"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="div mt-3">
                    <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "ReAssign Driver"}</button>
                    <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AssignDriver