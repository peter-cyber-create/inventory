import React, { useState, useEffect, Fragment } from 'react'
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import LoadSpinner from "../../../../components/FNSpinner";

const AddDispatch = ({ id, close, refresh }) => {

    const [loading, setLoading] = useState(false);
    const [dispatchedBy, setDispatchedBy] = useState("");
    const [dispatchedTo, setDispatchedTo] = useState("");
    const [qtyDispatched, setQtyDispatched] = useState("");
    const [part, setPart] = useState({});

    const getPart = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/request/${id}`);
            console.log(res)
            setLoading(false);
            setPart(res.data.part);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const data = {
            id,
            partno: part.partno,
            partname: part.partname,
            specification: part.specification,
            qtyMainStore: part.qtyMainStore - qtyDispatched,
            partId: part.partId,
            requestedBy: part.requestedBy,
            qtyDispatched,
            dispatchedBy,
            dispatchedTo
        }

        try {
            const res = await API.post(`/store`, data);
            console.log(res)
            toast.success(`Vehicle Part Dispatched Successfully`);
            close();
            refresh();
            setLoading(false)
        } catch (error) {
            setLoading(false);
            toast.error(`Vehicle Part Dispatch Failed`);
        }
    };

    useEffect(() => {
        getPart();
    }, []);

    return (
        <Fragment>
            <div className='card'>
                <div className='card-body'>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycfirstname-input" class="form-label">Part Name</label>
                                <input type="text" class="form-control" id="kycfirstname-input" placeholder="Enter Serial Number"
                                    value={part.partname}
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kyclastname-input" class="form-label">Part No</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Enter Engraved Number"
                                    value={part.partno}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Part Requested By</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Dispatched By"
                                    value={part.requestedBy}
                                    disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Quantity In Main Store</label>
                                <input type="text" class="form-control" placeholder="Enter Quantity Dispatched"
                                    value={part.qtyMainStore}
                                    onChange={(e) => setQtyDispatched(e.target.value)} disabled />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Quantity Requested</label>
                                <input type="text" class="form-control" placeholder="Enter Quantity Dispatched"
                                    value={part.qtyRequested}
                                    onChange={(e) => setQtyDispatched(e.target.value)} disabled />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Quantity Dispatched From Stores</label>
                                <input type="text" class="form-control" placeholder="Enter Quantity Dispatched"
                                    value={qtyDispatched}
                                    onChange={(e) => setQtyDispatched(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Dispatched By</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Dispatched By"
                                    value={dispatchedBy}
                                    onChange={(e) => setDispatchedBy(e.target.value)} />
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="kycselectcity-input" class="form-label">Dispatched To</label>
                                <input type="text" class="form-control" id="kyclastname-input" placeholder="Dispatched To"
                                    value={dispatchedTo}
                                    onChange={(e) => setDispatchedTo(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary waves-effect waves-light" type="submit" onClick={handleSubmit}>
                    {loading ? (
                        <LoadSpinner />
                    ) : (
                        'Dispatch From Main Store'
                    )}
                </button>
            </div>
        </Fragment>
    )
}

export default AddDispatch