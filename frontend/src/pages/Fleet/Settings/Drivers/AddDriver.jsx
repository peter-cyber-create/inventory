import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddDriver = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ phoneNo: "", names: "", employment: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/v/driver", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success(`Driver Has Been Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error Encountered while Adding Driver");
        }
    };

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Driver Full Names</label>
                                <input type="text" class="form-control" placeholder="Enter Driver Names"
                                    value={formData.names}
                                    onChange={(e) =>
                                        setFormData({ ...formData, names: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Driver Phone Number</label>
                                <input type="text" class="form-control" placeholder="Enter Phone Number"
                                    value={formData.phoneNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phoneNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Employment Status</label>
                                <select class="form-select"
                                    value={formData.employment}
                                    onChange={(e) =>
                                        setFormData({ ...formData, employment: e.target.value })
                                    }>
                                    <option>Select Employment Status</option>
                                    <option value="Permanet">Permanet</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add Driver Details"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddDriver