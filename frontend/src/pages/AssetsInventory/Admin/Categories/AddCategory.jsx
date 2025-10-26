import React, { useState, useEffect  } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddCategory = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({ name: "", typeId: "", description: ""});

    const loadType = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/type`);
            console.log(res)
            setTypes(res?.data.type);
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
            const response = await API.post("/category", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success(`Asset Category Has Been Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Asset Category");
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
                                <label for="kycselectcity-input" class="form-label">ICT Asset Category Name</label>
                                <input type="text" class="form-control" placeholder="Enter ICT Asset Category Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                            <label for="kycselectcity-input" class="form-label">ICT Asset Type</label>
                                <Select
                                    options={types.map(type => ({ value: type.id, label: type.name }))}
                                    onChange={(selectedOption) => setFormData({ ...formData, typeId: selectedOption.value })}
                                    placeholder="Select Asset Type"
                                    isSearchable
                                />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Description</label>
                                <textarea class="form-control" placeholder="Enter ICT Asset Category Description" rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add ICT Asset Category"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddCategory