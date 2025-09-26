import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from 'react-select';
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddModel = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", categoryId: "", brandId: "", description: "" });

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/category`);
            console.log(res)
            setCategories(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/brand`);
            console.log(res)
            setBrands(res?.data.assets);
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
            const response = await API.post("/model", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success(`Asset Model Has Been Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Asset Model");
        }
    };

    useEffect(() => {
        loadBrands();
        loadCategories();
    }, []);

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Model ICT Name</label>
                                <input type="text" class="form-control" placeholder="Enter Model Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Model ICT Category</label>
                                <Select
                                    options={categories.map(category => ({ value: category.id, label: category.name }))}
                                    onChange={(selectedOption) => setFormData({ ...formData, categoryId: selectedOption.value })}
                                    placeholder="Select Category"
                                    isSearchable
                                />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Model ICT Brand</label>
                                <Select
                                    options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
                                    onChange={(selectedOption) => setFormData({ ...formData, brandId: selectedOption.value })}
                                    placeholder="Select Brand"
                                    isSearchable
                                />
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Description</label>
                                <textarea class="form-control" placeholder="Enter Category Description" rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add ICT Asset Model"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddModel