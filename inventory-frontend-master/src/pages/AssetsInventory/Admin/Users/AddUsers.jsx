import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddUsers = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "", username: "", role: "",
        firstname: "", lastname: "", phoneNo: "", facilityId: "", email: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/users/register", formData);
            console.log(response)
            setLoading(false);
            close();
            refresh();
            toast.success(`User Added Successfully`);
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
                                <input type="text" class="form-control" placeholder="Add User Name"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Password</label>
                                <input type="password" class="form-control" placeholder="Add First Name"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">First Name</label>
                                <input type="text" class="form-control" placeholder="Add First Name"
                                    value={formData.firstname}
                                    onChange={(e) =>
                                        setFormData({ ...formData, firstname: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Last Name</label>
                                <input type="text" class="form-control" placeholder="Add User Name"
                                    value={formData.lastname}
                                    onChange={(e) =>
                                        setFormData({ ...formData, lastname: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Role</label>
                                <input type="text" class="form-control" placeholder="Add User Name"
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Facility</label>
                                <input type="text" class="form-control" placeholder="Add First Name"
                                    value={formData.facility}
                                    onChange={(e) =>
                                        setFormData({ ...formData, facility: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Phone Number</label>
                                <input type="text" class="form-control" placeholder="Add Phone Number"
                                    value={formData.phoneNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phoneNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Email</label>
                                <input type="text" class="form-control" placeholder="Add Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    } />
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