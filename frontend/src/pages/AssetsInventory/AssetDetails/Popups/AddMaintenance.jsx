import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner'

const AddMaintenance = ({ close, id, maintenance }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        servicedBy: "", servicedOn: "", nextService: "", taskName: "", description: "", assetId: id});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/api/maintenance', formData);
            setLoading(false);
            close();
            maintenance();
            toast.success('Maintenance Details Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error While Adding Maintenance Details");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Task Name</label>
                            <input type="text" class="form-control" placeholder="Enter Task Name"
                                value={formData.taskName}
                                onChange={(e) =>
                                    setFormData({ ...formData, taskName: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Serviced By</label>
                            <input type="text" class="form-control" placeholder="Enter Serviced By Company"
                                value={formData.servicedBy}
                                onChange={(e) =>
                                    setFormData({ ...formData, servicedBy: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Serviced On</label>
                            <input type="date" class="form-control" placeholder="Enter Serviced Date"
                                value={formData.servicedOn}
                                onChange={(e) =>
                                    setFormData({ ...formData, servicedOn: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Next Service Date</label>
                            <input type="date" class="form-control" placeholder="Enter Next Service Date"
                                value={formData.nextService}
                                onChange={(e) =>
                                    setFormData({ ...formData, nextService: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Description</label>
                            <textarea class="form-control" placeholder="Enter Service Details" rows="4"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
            </div>
            <div className="div mt-3">
                <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Add Maintenance"}</button>
                <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

export default AddMaintenance