import React, { useState, Fragment } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddFacility = ({ refresh, close }) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");
    const [region, setRegion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = { name, level, region };

        try {
            await API.post(`/facility`, data);
            toast.success("Health Facility Added Successfully");
            close();
            refresh();
        } catch (error) {
            console.error("Error adding staff:", error);
            toast.error("Error While Adding Health Facility");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="card overflow-hidden">
                <div className="card-body pt-0">
                    <div className="p-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">Health Facility</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Health Facility"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">Health Facility Level</label>
                                    <select class="form-select" id="kycselectcity-input" value={level}
                                        onChange={(e) => setLevel(e.target.value)}>
                                        <option value="HC II" selected="">HC II</option>
                                        <option value="HC III">HC III</option>
                                        <option value="HC IV">HC IV</option>
                                        <option value="General Hospital">General Hospital</option>
                                        <option value="Regional Referral Hospital">Regional Referral Hospital</option>
                                        <option value="National Referral Hospital">National Referral Hospital</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label">Health Facility Region</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter REgion"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            className="btn btn-primary waves-effect waves-light"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <FNSpinner /> : "Add Health Facility"}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddFacility;