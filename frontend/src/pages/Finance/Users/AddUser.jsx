import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const AddUsers = ({ close, refresh }) => {
    const [password, setPassword] = useState("");
    const [username, setuserName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [module, setModule] = useState("");
    const [depart, setDepart] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            password,
            username,
            role: 'finance',
            firstname,
            lastname,
            email,
            module,
            depart,
            facilityId: 1
        }

        try {
            const response = await API.post('/api/users/register', data);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success('User Added Successfully');
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while New User");
        }
    };

    return (
        <div class="card custom-card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">User Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter User Name"
                                    value={username}
                                    onChange={(e) => setuserName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Password</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter First Name"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Last Name"
                                    value={lastname}
                                    onChange={(e) => setlastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">System Module</label>
                                <select class="form-select" id="kycselectcity-input" value={module}
                                    onChange={(e) => setModule(e.target.value)}>
                                    <option value="" selected="">Select System Module</option>
                                    <option value="Admin" selected="">Admin</option>
                                    <option value="Funder">Funder Accountant</option>
                                    <option value="GOU">GOU</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Funding Accountant</label>
                                <select class="form-select" id="kycselectcity-input" value={depart}
                                    onChange={(e) => setDepart(e.target.value)}>
                                    <option value="" selected="">Select Funding Accountant</option>
                                    <option value="Global Fund">Global Fund</option>
                                    <option value="UCREPP">UCREPP</option>
                                    <option value="GAVI">GAVI</option>
                                    <option value="GOU">GOU</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add New User"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddUsers