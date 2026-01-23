import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddType = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: ""});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/api/v/type', formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('Vehicle Type Has Been Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Vehicle Type");
        }
    };

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Vehicle Type Name</label>
                                <input type="text" class="form-control" placeholder="Enter Vehicle Type Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add Vehicle Type"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddType