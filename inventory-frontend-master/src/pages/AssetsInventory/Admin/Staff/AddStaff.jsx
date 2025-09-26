import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddStaff = ({ refresh, close }) => {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [phoneno, setPhoneNo] = useState("");
    const [deptId, setDeptId] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [divisions, setDivisions] = useState([]);

    const loadDivisions = async () => {
        setLoading(true);
        try {
            const res = await API.get("/division");
            setDivisions(res?.data?.division || []);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDepts = async () => {
        setLoading(true);
        try {
            const res = await API.get("/department");
            setDepts(res?.data?.depts || []);
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeptChange = (selectedOption) => {
        setDeptId(selectedOption?.value || "");
    };

    const handleDivisionChange = (selectedOption) => {
        setDivisionId(selectedOption?.value || "");
    };

    const filteredDivisions = divisions.filter((div) => div.deptId === deptId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = { name, title, email, phoneno, deptId, divisionId };

        try {
            await API.post(`/staff`, data);
            toast.success("Staff Added Successfully");
            close();
            refresh();
        } catch (error) {
            console.error("Error adding staff:", error);
            toast.error("Error While Adding Staff");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepts();
        loadDivisions();
    }, []);

    return (
        <Fragment>
            <div className="card overflow-hidden">
                <div className="card-body pt-0">
                    <div className="p-4">
                        <div className="row">
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Staff Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Staff Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Job Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Department</label>
                                    <Select
                                        options={depts.map((dept) => ({
                                            value: dept.id,
                                            label: dept.name,
                                        }))}
                                        onChange={handleDeptChange}
                                        placeholder="Select Department"
                                        isSearchable
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Division / Section / Unit</label>
                                    <Select
                                        options={filteredDivisions.map((division) => ({
                                            value: division.id,
                                            label: division.name,
                                        }))}
                                        onChange={handleDivisionChange}
                                        placeholder="Select Division / Section"
                                        isSearchable
                                        isDisabled={!deptId}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="Enter Phone Number"
                                        value={phoneno}
                                        onChange={(e) => setPhoneNo(e.target.value)}
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
                            {loading ? <FNSpinner /> : "Add New Staff"}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddStaff;