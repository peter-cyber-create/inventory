import React from 'react'
import FNSpinner from '../../../../../components/FNSpinner'

const AddService = ({ handleSubmit, loading, close }) => {
    return (
        <div class="card">
            <div class="card-body">
                <div className="row">
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Staff Name</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="Driver Name" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Department</label>
                            <input type="text" class="form-control" autocomplete="off" placeholder="Department" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Assigned Date</label>
                            <input type="date" class="form-control" autocomplete="off" placeholder="Disposal Date"
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="mb-3">
                            <label class="form-label">Remarks</label>
                            <textarea type="text" class="form-control" autocomplete="off" placeholder="Assignment Remarks" />
                        </div>
                    </div>
                </div>
                <div className="div mt-3">
                    <button class="btn btn-primary me-2" onClick={handleSubmit}>{loading ? <FNSpinner /> : "Add Service"}</button>
                    <button class="btn btn-outline-primary" onClick={close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddService