import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const AddParts = ({ close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        partname: "", partno: "", quantity: "", specification: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/parts", formData);
            setLoading(false);
            close();
            refresh();
            toast.success(`Vehicle Parts Have Been Added Successfully`);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.error("Error while Adding Vehicle Parts");
        }
    };

    return (
        <div class="card">
            <div class="card-body">
                <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
                    <form>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label for="kycfirstname-input" class="form-label">Vehicle Part Name</label>
                                    <input type="text" class="form-control" placeholder="Enter Part Name"
                                        value={formData.partname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, partname: e.target.value })
                                        } />
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Vehicle Part Number</label>
                                    <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Part Number"
                                        value={formData.partno}
                                        onChange={(e) =>
                                            setFormData({ ...formData, partno: e.target.value })
                                        } />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Part Specification</label>
                                    <input type="text" class="form-control" placeholder="Enter BarCode"
                                        value={formData.specification}
                                        onChange={(e) =>
                                            setFormData({ ...formData, specification: e.target.value })
                                        } />
                                </div>
                            </div>
                            {/* <div class="col-lg-6">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Unit Price</label>
                                    <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Unit Price"
                                        value={formData.unitprice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, unitprice: e.target.value })
                                        } />
                                </div>
                            </div> */}
                        </div>
                        {/* <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Part Specification</label>
                                    <select class="form-select"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }>
                                        <option>Select Product Category</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Computer">Computer</option>
                                        <option value="Oil Filters">Oil Filters</option>
                                        <option value="Stationary">Stationary</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Brand</label>
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
                        </div> */}
                        <div class="row">
                            {/* <div class="col-lg-6">
                                <div class="mb-3">
                                    <label for="kycselectcity-input" class="form-label">Total Price</label>
                                    <input type="text" class="form-control" placeholder="Enter BarCode"
                                        value={formData.totalprice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, totalprice: e.target.value })
                                        } />
                                </div>
                            </div> */}
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label for="kycfirstname-input" class="form-label">Part Quantity</label>
                                    <input type="text" class="form-control" placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={(e) =>
                                            setFormData({ ...formData, quantity: e.target.value })
                                        } />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="actions clearfix">
                        <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
                            {loading ? <FNSpinner /> : "Add Vehicle Parts"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AddParts