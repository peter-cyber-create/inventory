import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddBrand = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const loadType = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/types`);
            console.log(res)
            setTypes(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/brand", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('Asset Brand Has Been Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Asset Brand");
        }
    };

    useEffect(() => {
        loadType();
    }, []);

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">ICT Asset Brand Name</label>
                                <input type="text" class="form-control" placeholder="Enter ICT Asset Brand"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Description</label>
                                <textarea class="form-control" placeholder="Enter Brand Description" rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add ICT Asset Brand"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddBrand