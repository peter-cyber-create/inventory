import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddDivision = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [depts, setDepts] = useState([]);
    const [formData, setFormData] = useState({ name: "", deptId: "" });

    const loadDepts = async () => {
        setLoading(true);
        try {
            const res = await API.get("/department");
            console.log(res)
            setDepts(res?.data.depts);
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
            const response = await API.post("/division", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success(`Division / Unit Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Division / Unit");
        }
    };

    useEffect(() => {
        loadDepts();
    }, []);

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-4">
                                <label for="kycselectcity-input" class="form-label">Department</label>
                                <Select
                                    options={depts.map(dept => ({ value: dept.id, label: dept.name }))}
                                    onChange={(selectedOption) => setFormData({ ...formData, deptId: selectedOption.value })}
                                    placeholder="Select Department"
                                    isSearchable
                                />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-4">
                                <label for="kycselectcity-input" class="form-label">Division / Section / Unit</label>
                                <input type="text" class="form-control" placeholder="Enter Model Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add Division / Unit"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddDivision