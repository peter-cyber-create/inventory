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

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!formData.user || formData.user.trim() === '') {
            toast.error('Assigned User is required');
            return false;
        }
        if (rows.length === 0) {
            toast.error('At least one asset must be added');
            return false;
        }
        for (const row of rows) {
            if (!row.asset || row.asset.trim() === '') {
                toast.error('Asset description is required for all rows');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
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
            // Remove console.log in production
            if (process.env.NODE_ENV === 'development') {
                console.log('Asset creation response:', response);
            }
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
            // Log errors only in development
            if (process.env.NODE_ENV === 'development') {
                console.error("Asset creation error:", error);
                console.error("Error response:", error.response);
            }
            setLoading(false);
            
            // API interceptor already sets error.message, but check all sources
            const errorMessage = error.message 
                || error.response?.data?.message 
                || error.response?.data?.error
                || (error.response?.data?.errors && Array.isArray(error.response.data.errors) 
                    ? error.response.data.errors.map(e => e.error || e.message || JSON.stringify(e)).join(', ')
                    : null)
                || "Error while Adding ICT Asset";
            
            // Log error only in development
            if (process.env.NODE_ENV === 'development') {
                console.error("Displaying error:", errorMessage);
            }
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

    return (
        <div className="wizard clearfix">
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Assigned User Information</h5>
                </div>
                <div className="card-body p-4">
                    <Step1 formData={formData} setFormData={setFormData} />
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">ICT Asset Line Items</h5>
                </div>
                <div className="card-body p-4">
                    <Step2 rows={rows} setRows={setRows} />
                </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <FNSpinner /> : "Add ICT Asset"}
                </button>
            </div>
        </div>
    )
}

export default AddAsset