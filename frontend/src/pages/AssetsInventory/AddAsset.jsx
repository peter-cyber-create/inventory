/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../helpers/api";
import notificationService from "../../services/notificationService";

import Step1 from "./Stepper/Step1";
import Step2 from "./Stepper/Step2";
import FNSpinner from "../../components/FNSpinner";

const AddAsset = ({ close, refresh }) => {

    const [formData, setFormData] = useState({ user: "", department: "", phoneNo: "", jobTitle: "", email: "", purchaseDate: "" });
    const [rows, setRows] = useState([
        { id: 1, asset: '', category: '', serialNo: '', engravedNo: '', model: '', funding: '' }
    ]);

    const tabData = [
        { id: 0, label: 'Assigned User Details' },
        { id: 1, label: 'Asset Details' }
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

        const requestData = {
            ...formData,
            rows: rows.map(row => ({
                asset: row.asset,
                model: row.model,
                serialNo: row.serialNo,
                engravedNo: row.engravedNo,
                funding: row.funding,
                category: row.category
            }))
        };

        try {
            const response = await API.post('/api/assets', requestData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('ICT Asset Has Been Added Successfully');
            
            // Add notification for successful asset creation
            notificationService.assets(
                'Asset Added Successfully',
                `New ICT asset has been assigned to ${formData.user}`,
                'success',
                'medium'
            );
        } catch (error) {
            console.error("Asset creation error:", error);
            console.error("Error response:", error.response);
            setLoading(false);
            
            // API interceptor already sets error.message, but check all sources
            const errorMessage = error.message 
                || error.response?.data?.message 
                || error.response?.data?.error
                || (error.response?.data?.errors && Array.isArray(error.response.data.errors) 
                    ? error.response.data.errors.map(e => e.error || e.message || JSON.stringify(e)).join(', ')
                    : null)
                || "Error while Adding ICT Asset";
            
            console.error("Displaying error:", errorMessage);
            toast.error(errorMessage);
            
            // Add notification for failed asset creation
            notificationService.assets(
                'Asset Addition Failed',
                errorMessage,
                'error',
                'high'
            );
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
                    <Step2 rows={rows} setRows={setRows} close={close}
                        handleSubmit={handleSubmit} loading={loading} />
                );
            default:
                return null;
        }
    };

    return (
        <div id="kyc-verify-wizard" role="application" className="wizard clearfix">
            <div className="card">
                <div className="card-body p-4">
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
                </div>
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
                            <a onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>{loading ? <FNSpinner /> : "Add ICT Asset"}</a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AddAsset