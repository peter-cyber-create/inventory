import React, { Fragment } from "react";

const Step1 = ({ formData, setFormData }) => {
    return (
        <Fragment>
            <section id="kyc-verify-wizard-p-2" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-2" class="body" aria-hidden="true">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kycphoneno-input" class="form-label">Assigned User</label>
                            <input type="text" class="form-control" placeholder="Enter User Name"
                                value={formData.user}
                                onChange={(e) =>
                                    setFormData({ ...formData, user: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="basicpill-servicetax-input">Purchase Date</label>
                            <input type="date" class="form-control" placeholder="Enter User Email"
                                value={formData.purchaseDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, purchaseDate: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="kycbirthdate-input" class="form-label">Department / Office / Project</label>
                            <input type="text" class="form-control" placeholder="Enter User Department"
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({ ...formData, department: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">User Job Post</label>
                            <input type="text" class="form-control" placeholder="Enter User Job Post"
                                value={formData.jobTitle}
                                onChange={(e) =>
                                    setFormData({ ...formData, jobTitle: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="basicpill-servicetax-input">User Email</label>
                            <input type="text" class="form-control" placeholder="Enter User Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">Phone Number</label>
                            <input type="text" class="form-control" placeholder="Enter User Phone No"
                                value={formData.phoneNo}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNo: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Step1