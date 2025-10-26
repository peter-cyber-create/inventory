/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";

import Step1 from "./Stepper/Step1";
import Step2 from "./Stepper/Step2";
import FNSpinner from "../../../components/FNSpinner";

const AddServer = ({ close, refresh }) => {

    const [formData, setFormData] = useState({
        serialNo: "", engranvedNo: "", serverName: "", productNo: "", brand: "",
        IP: "", purchaseDate: "", warrantly: "", expiryDate: "", memory: "",
        processor: "", hypervisor: "", hardDisk: "",
    });

    const tabData = [
        { id: 0, label: 'Basic Information' },
        { id: 1, label: 'Server Specifications' },
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
            const response = await API.post("/servers/virtual", formData);
            setLoading(false);
            close();
            refresh();
            toast.success(`Host Server Has Been Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Host Server");
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Step1 formData={formData} setFormData={setFormData} />
                );
            case 1:
                return (
                    <Step2 formData={formData} setFormData={setFormData} />
                );
            default:
                return null;
        }
    };

    return (
        <div id="kyc-verify-wizard" role="application" className="wizard clearfix">
            <div className="steps clearfix">
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
            <div className="content clearfix">
                {renderStepContent(currentStep)}
            </div>
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
                            <a onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>{loading ? <FNSpinner /> : "Add Virtual Server"}</a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AddServer