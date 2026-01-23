import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner'

const AddDisposal = ({ close, id, disposal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        disposalDate: "", disposalMethod: "", disposalReason: "", disposalCost: "", disposedBy: "", assetId: id});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/disposal", formData);
            setLoading(false);
            close();
            disposal();
            toast.success('Asset Successfully Disposed Off');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error While Disposing Off Asset");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Disposal Date</label>
                            <input type="date" class="form-control" placeholder="Enter Task Name"
                                value={formData.disposalDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, disposalDate: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Disposal Method</label>
                            <input type="text" class="form-control" placeholder="Enter Disposal Method"
                                value={formData.disposalMethod}
                                onChange={(e) =>
                                    setFormData({ ...formData, disposalMethod: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Disposal Cost</label>
                            <input type="text" class="form-control" placeholder="Enter Disposal Cost"
                                value={formData.disposalCost}
                                onChange={(e) =>
                                    setFormData({ ...formData, disposalCost: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Disposed By</label>
                            <input type="text" class="form-control" placeholder="Disposed By"
                                value={formData.disposedBy}
                                onChange={(e) =>
                                    setFormData({ ...formData, disposedBy: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="mb-3">
                            <label for="kyclastname-input" class="form-label">Disposal Reason</label>
                            <textarea class="form-control" placeholder="Enter Disposal Reason" rows="4"
                                value={formData.disposalReason}
                                onChange={(e) =>
                                    setFormData({ ...formData, disposalReason: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
            </div>
            <div className="div mt-3">
                <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Dispose Asset"}</button>
                <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

export default AddDisposal