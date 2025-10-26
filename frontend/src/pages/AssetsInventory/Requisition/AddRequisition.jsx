import React, { useState, Fragment } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import LoadSpinner from "../../../components/FNSpinner";

const AddRequisition = ({
  id,
  serialNo,
  model,
  setModel,
  setSerialNo,
  close,
  refresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [requestedBy, setRequestedBy] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      serialNo,
      model,
      requestedBy,
      comments,
      assetId: id,
    };

    try {
      const res = await API.post(`/requisition`, data);
      console.log(res);
      toast.success(`Stores Requisition Placed Successful`);
      close();
      refresh();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Stores Requisition Failed`);
    }
  };

  return (
    <Fragment>
      <div className="card">
        <div className="card-body">
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label for="kycfirstname-input" class="form-label">
                  Serial Number
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="kycfirstname-input"
                  placeholder="Enter Serial Number"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div class="col-lg-12">
              <div class="mb-3">
                <label for="kyclastname-input" class="form-label">
                  Model
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="kyclastname-input"
                  placeholder="Enter Engraved Number"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label for="kycselectcity-input" class="form-label">
                  Requested By
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="kyclastname-input"
                  placeholder="Requested By"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label for="kycselectcity-input" class="form-label">
                  Comments
                </label>
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Enter Comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <button
          class="btn btn-primary waves-effect waves-light"
          type="submit"
          onClick={handleSubmit}
        >
          {loading ? <LoadSpinner /> : "Place Requisition To Stores"}
        </button>
      </div>
    </Fragment>
  );
};

export default AddRequisition;
