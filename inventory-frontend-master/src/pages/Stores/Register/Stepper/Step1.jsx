import React, { Fragment } from "react";
import Select from 'react-select';

const Step1 = ({ formData, setFormData, brands, models }) => {

    const filteredModels = models.filter(model => model.brandId === formData.brandId);

    return (
        <Fragment>
            <section id="kyc-verify-wizard-p-2" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-2" class="body" aria-hidden="true">
                <div class="row">
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-servicetax-input">Asset Brand</label>
                            <Select
                                options={brands ? brands.map(brand => ({ value: brand.id, label: brand.name })) : []}
                                onChange={(selectedOption) => setFormData({ ...formData, brandId: selectedOption.value })}
                                placeholder="Select Brand"
                                isSearchable
                            />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-servicetax-input">Asset Model</label>
                            <Select
                                options={filteredModels ? filteredModels.map(model => ({ value: model.id, label: model.name })) : []}
                                onChange={(selectedOption) => setFormData({ ...formData, modelId: selectedOption.value })}
                                placeholder="Select Model"
                                isSearchable
                            />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">Supplier</label>
                            <input type="text" class="form-control" placeholder="Enter Supplier"
                                value={formData.supplier}
                                onChange={(e) =>
                                    setFormData({ ...formData, supplier: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">Purchase Date</label>
                            <input type="date" class="form-control" placeholder="Enter Purchase Date"
                                value={formData.purchaseDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, purchaseDate: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="kycbirthdate-input" class="form-label">Order Number</label>
                            <input type="text" class="form-control" placeholder="Enter Order Number"
                                value={formData.orderNo}
                                onChange={(e) =>
                                    setFormData({ ...formData, orderNo: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">Purchase Cost</label>
                            <input type="text" class="form-control" placeholder="Enter Purchase Cost"
                                value={formData.purchaseCost}
                                onChange={(e) =>
                                    setFormData({ ...formData, purchaseCost: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-servicetax-input">Serial Number</label>
                            <input type="text" class="form-control" placeholder="Enter Serial Number"
                                value={formData.serialNo}
                                onChange={(e) =>
                                    setFormData({ ...formData, serialNo: e.target.value })
                                } />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="mb-3">
                            <label for="basicpill-cstno-input">Engraved Number</label>
                            <input type="text" class="form-control" placeholder="Enter Engraved Number"
                                value={formData.engravedNo}
                                onChange={(e) =>
                                    setFormData({ ...formData, engravedNo: e.target.value })
                                } />
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Step1