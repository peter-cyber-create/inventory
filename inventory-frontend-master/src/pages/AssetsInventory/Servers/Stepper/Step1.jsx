import React, { Fragment } from "react";

const Step1 = ({ formData, setFormData }) => {
    return (
        <Fragment>
            <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                <form>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Serial Number</label>
                                <input type="text" class="form-control" id="kycfirstname-input" placeholder="Enter Serial Number"
                                    value={formData.serialNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, serialNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kyclastname-input" class="form-label">Engraved Number</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Engraved Number"
                                    value={formData.engranvedNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, engranvedNo: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Server Name</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Server Name"
                                    value={formData.serverName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, serverName: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Server Brand</label>
                                <select class="form-select"
                                    value={formData.brand}
                                    onChange={(e) =>
                                        setFormData({ ...formData, brand: e.target.value })
                                    }>
                                    <option>Select Asset Make</option>
                                    <option value="HP">HP</option>
                                    <option value="Dell">Dell</option>
                                    <option value="Lavarevel">Larevl</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Product Number</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Product Number"
                                    value={formData.productNo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, productNo: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">IP Address</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter IP Address"
                                    value={formData.IP}
                                    onChange={(e) =>
                                        setFormData({ ...formData, IP: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </Fragment>
    )
}

export default Step1