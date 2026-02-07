import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import API from '../../../../helpers/api';
import FNModal from '../../../../components/FNModal';
import AddModel from './AddModel';
import FNSpinner from '../../../../components/FNSpinner';
import FNTable from '../../../../components/FNTable';

const Models = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [models, setModels] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleFileSelect = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setLoading(true); 
        setUploadProgress(0); 

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await API.post('/api/uploads/models', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentage); 
                },
            });

            toast.success(response.data.message || 'File uploaded successfully!');
            setFile(null); 
            loadModels(); 
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading the file. Please try again.');
        } finally {
            setLoading(false); 
        }
    };

    const loadModels = async () => {
        setLoading(true);
        try {
            const res = await API.get('/api/model');
            // Defensively normalize: ensure we always have an array
            const modelsList = Array.isArray(res?.data?.model) 
                ? res.data.model 
                : Array.isArray(res?.data?.assets) 
                    ? res.data.assets 
                    : Array.isArray(res?.data) 
                        ? res.data 
                        : [];
            setModels(modelsList);
        } catch (error) {
            console.error('Error loading models:', error);
            toast.error('Failed to load models. Please try again.');
            // On error, set empty array to prevent .map() crashes
            setModels([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await API.get('/api/downloads/models', {
                responseType: 'blob', 
            });

            // Create a blob URL from the response
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor tag for downloading the file
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ICT Models.xlsx'; // Set the desired file name
            document.body.appendChild(a);
            a.click();

            // Clean up the temporary anchor tag and blob URL
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file. Please try again.');
        }
    };


    useEffect(() => {
        loadModels();
    }, []);

    const tableColumns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Model Name' },
        { key: 'category.name', label: 'Model Category' },
        { key: 'brand.name', label: 'Model Brand' },
        { key: 'description', label: 'Description' },
    ];

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add Asset Model"
            >
                <AddModel close={handleClose} refresh={loadModels} />
            </FNModal>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0 font-size-18">ICT Asset Models Listing</h4>
                        <div className="page-title-right">
                            <button
                                className="btn btn-warning waves-effect waves-light btn-sm"
                                onClick={downloadExcel}
                            >
                                Download Models<i className="mdi mdi-arrow-right ms-1"></i>
                            </button>
                            <div className="d-inline-block ms-2">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                />
                                <button
                                    className="btn btn-primary waves-effect waves-light btn-sm"
                                    onClick={() => document.getElementById('fileInput').click()}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span>
                                            Uploading... {uploadProgress}%
                                            <span className="spinner-border spinner-border-sm ms-2"></span>
                                        </span>
                                    ) : (
                                        'Select & Upload File'
                                    )}
                                </button>
                                {file && !loading && (
                                    <button
                                        className="btn btn-success waves-effect waves-light btn-sm ms-2"
                                        onClick={handleFileUpload}
                                    >
                                        Confirm Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <FNSpinner />
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="searchTableList"
                                            placeholder="Search..."
                                        />
                                        <i className="bx bx-search-alt search-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8 text-sm-end">
                                <button
                                    type="button"
                                    className="btn btn-primary waves-effect waves-light btn-sm"
                                    onClick={handleShow}
                                >
                                    Add ICT Asset Model
                                </button>
                            </div>
                        </div>
                        <FNTable columns={tableColumns} data={models} />
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Models;
