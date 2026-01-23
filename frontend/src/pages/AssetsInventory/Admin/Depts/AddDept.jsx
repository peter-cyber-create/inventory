import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddDept = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: ""});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/department", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('MOH HQ Dept Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Asset Type");
        }
    };

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Department Name</label>
                                <input type="text" class="form-control" placeholder="Add Department"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                        {/* <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Description</label>
                                <textarea class="form-control" placeholder="Enter Asset Type Description" rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    } />
                            </div>
                        </div> */}
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add Department"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddDept