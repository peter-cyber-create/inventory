import React, { Fragment } from "react";

const Step2 = ({ formData, setFormData }) => {

    return (
        <Fragment>
            <div class="row">
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="kycbirthdate-input" class="form-label">Processor</label>
                        <input type="text" class="form-control" placeholder="Enter Processor"
                            value={formData.processor}
                            onChange={(e) =>
                                setFormData({ ...formData, processor: e.target.value })
                            } />
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-cstno-input">Memory</label>
                        <input type="text" class="form-control" placeholder="Enter Memory"
                            value={formData.memory}
                            onChange={(e) =>
                                setFormData({ ...formData, memory: e.target.value })
                            } />
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-cstno-input">Graphics</label>
                        <input type="text" class="form-control" placeholder="Enter Graphics"
                            value={formData.graphics}
                            onChange={(e) =>
                                setFormData({ ...formData, graphics: e.target.value })
                            } />
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-servicetax-input">Storage</label>
                        <input type="text" class="form-control" placeholder="Enter Storage"
                            value={formData.storage}
                            onChange={(e) =>
                                setFormData({ ...formData, storage: e.target.value })
                            } />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-cstno-input">Source of Funding</label>
                        <select class="form-select"
                            value={formData.funding}
                            onChange={(e) =>
                                setFormData({ ...formData, funding: e.target.value })
                            }>
                            <option value="">Select Funding Source</option>
                            <option value="GOU">GOU</option>
                            <option value="PROJECTS">PROJECTS</option>
                            <option value="DONATION">DONATION</option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-cstno-input">Funder</label>
                        <select class="form-select"
                            value={formData.funder}
                            onChange={(e) =>
                                setFormData({ ...formData, funder: e.target.value })
                            }>
                            <option value="">Select Funding</option>
                            {formData.funding === 'GOU' && <option value="GOU">GOU</option>}
                            {formData.funding === 'PROJECTS' && (
                                <>
                                    <option value="URMCHIP">URMCHIP</option>
                                    <option value="UCREPP">UCREPP</option>
                                    <option value="GLOBALFUND">GLOBAL FUND</option>
                                </>
                            )}
                            {formData.funding === 'DONATION' && (
                                <>
                                    <option value="UNICEF">UNICEF</option>
                                    <option value="USAID">USAID</option>
                                    <option value="WHO">WHO</option>
                                    <option value="MSH">MSH</option>
                                    <option value="METS">METS</option>
                                    <option value="JPHIEGO">JPHIEGO</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-servicetax-input">Estimated Cost</label>
                        <input type="text" class="form-control" placeholder="Enter Estimated Cost"
                            value={formData.estimatedCost}
                            onChange={(e) =>
                                setFormData({ ...formData, estimatedCost: e.target.value })
                            } />
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="mb-3">
                        <label for="basicpill-cstno-input">Warrantly</label>
                        <input type="text" class="form-control" placeholder="Enter Warrantly"
                            value={formData.warrantly}
                            onChange={(e) =>
                                setFormData({ ...formData, warrantly: e.target.value })
                            } />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Step2