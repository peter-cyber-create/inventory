import React, { Fragment } from "react";

const Step2 = ({ formData, setFormData }) => {

    return (
        <Fragment>
            <section id="kyc-verify-wizard-p-1" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-1" class="body" aria-hidden="true">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycphoneno-input" class="form-label">Memory</label>
                                <input type="text" class="form-control" id="kycphoneno-input" placeholder="Enter Server Memory"
                                    value={formData.memory}
                                    onChange={(e) =>
                                        setFormData({ ...formData, memory: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycbirthdate-input" class="form-label">Processor</label>
                                <input type="text" class="form-control" id="kycbirthdate-input" placeholder="Enter Processor"
                                    value={formData.processor}
                                    onChange={(e) =>
                                        setFormData({ ...formData, processor: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="basicpill-companyuin-input">Hypervisor</label>
                                <input type="text" class="form-control" id="basicpill-companyuin-input" placeholder="Enter Hypervisor"
                                    value={formData.hypervisor}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hypervisor: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="basicpill-declaration-input">Hard Disk Space</label>
                                <input type="text" class="form-control" id="basicpill-Declaration-input" placeholder="Enter Hard Disk Size"
                                    value={formData.hardDisk}
                                    onChange={(e) =>
                                        setFormData({ ...formData, hardDisk: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="basicpill-cstno-input">Purchase Date</label>
                                <input type="date" class="form-control" id="basicpill-cstno-input" placeholder="Enter Purchase Date."
                                    value={formData.purchaseDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, purchaseDate: e.target.value })
                                    } />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="basicpill-warranty-input">Warranty Period</label>
                                <input type="text" class="form-control" id="basicpill-warranty-input" placeholder="Enter Warranty Period (e.g., 1 Year, 2 Years)"
                                    value={formData.warranty}
                                    onChange={(e) =>
                                        setFormData({ ...formData, warranty: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="basicpill-servicetax-input">Warranty Expiry Date</label>
                                <input type="date" class="form-control" id="basicpill-servicetax-input" placeholder="Warranty Expiry Date"
                                    value={formData.expiryDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, expiryDate: e.target.value })
                                    } />
                            </div>
                        </div>
                    </div>
                    
            </section>
        </Fragment>
    )
}

export default Step2