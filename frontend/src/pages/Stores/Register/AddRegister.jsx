/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

import Step1 from "./Stepper/Step1";
import Step2 from "./Stepper/Step2";

const AddRegister = ({ close, refresh }) => {

    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [models, setModel] = useState([]);
    const [formData, setFormData] = useState({
        serialNo: "", engravedNo: "", processor: "", memory: "", graphics: "", storage: "", typeId: "",
        orderNo: "", supplier: "", funding: "", funder: "", purchaseCost: "", purchaseDate: "", warrantly: "", categoryId: "", brandId: "",
        modelId: "", estimatedCost: "" });

    const tabData = [
        { id: 0, label: 'Asset Details' },
        { id: 1, label: 'Asset Specifications' }
    ];

    const [loading, setLoading] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/api/assetss', formData);
            setLoading(false);
            close();
            refresh();
            toast.success('Asset Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Asset");
        }
    };

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

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/category`);
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
            setBrands(res?.data.assets);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const loadModel = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/model`);
            setModel(res?.data.model);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const handleAssetTypeChange = (selectedOption) => {
        const selectedTypeId = selectedOption.value;
        setFormData({ ...formData, typeId: selectedTypeId });
    };

    const filteredCategories = categories.filter(category => category.typeId === formData.typeId);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Step1
                        formData={formData}
                        setFormData={setFormData}
                        models={models}
                        brands={brands}
                    />
                );
            case 1:
                return (
                    <Step2 formData={formData} setFormData={setFormData} />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        loadType();
        loadBrands();
        loadCategories();
        loadModel()
    }, []);

    return (
        <div id="kyc-verify-wizard" role="application" className="wizard clearfix">
            <>
                <div class="p-4">
                    <div className="steps clearfix mb-4">
                        <ul role="tablist">
                            {tabData.map((tab) => (
                                <li
                                    key={tab.id}
                                    role="tab"
                                    className={`${currentStep === tab.id ? 'current' : ''} ${currentStep > tab.id ? 'completed' : ''} ${currentStep < tab.id ? 'disabled' : ''} ${tab.id === 2 ? 'last' : ''}`}
                                    aria-selected={currentStep === tab.id}
                                >
                                    <a href={`#kyc-verify-wizard-h-${tab.id}`} id={`kyc-verify-wizard-t-${tab.id}`} aria-controls={`kyc-verify-wizard-p-${tab.id}`}>
                                        <span className="current-info audible">current step: </span>
                                        <span className="number">{tab.id + 1}.</span> {tab.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div class="col-lg-6">
                                    <div class="mb-4">
                                        <label for="kycselectcity-input" class="form-label">Asset Type</label>
                                        <Select
                                            options={types ? types.map(type => ({ value: type.id, label: type.name })) : []}
                                            onChange={handleAssetTypeChange}
                                            placeholder="Select Asset Type"
                                            isSearchable
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-4">
                                        <label for="kycselectcity-input" class="form-label">Asset Category</label>
                                        <Select
                                            options={filteredCategories ? filteredCategories.map(category => ({ value: category.id, label: category.name })) : []}
                                            onChange={(selectedOption) => setFormData({ ...formData, categoryId: selectedOption.value })}
                                            placeholder="Select Category"
                                            isSearchable
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            {renderStepContent(currentStep)}
                        </div>
                    </div>
                </div>
            </>
            <div className="actions clearfix">
                <ul role="menu" aria-label="Pagination">
                    <li className={currentStep === 0 ? 'disabled' : ''} onClick={handlePrev}>
                        <a href="#previous" role="menuitem">Previous</a>
                    </li>
                    {currentStep < 1 ? (
                        <li onClick={handleNext}>
                            <a href="#next" role="menuitem">Next</a>
                        </li>
                    ) : (
                        <li style={{ display: currentStep === 1 ? 'inline' : 'none' }}>
                            <a onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>{loading ? <FNSpinner /> : "Add Asset"}</a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AddRegister