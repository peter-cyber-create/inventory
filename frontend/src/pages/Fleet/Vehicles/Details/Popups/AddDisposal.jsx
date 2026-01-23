import React, { useState } from "react";
import FNSpinner from "../../../../../components/FNSpinner";
import API from "../../../../../helpers/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const AddDisposal = ({ close, vehicle }) => {
  const [loading, setLoading] = useState();
  const [vehicleId, setVehicleId] = useState(vehicle.id);
  const [disposalReason, setdisposalReason] = useState("");
  const [disposalCost, setdisposalCost] = useState("");
  const [disposedBy, setdisposedBy] = useState("");

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      disposalReason,
      disposalCost,
      disposedBy,
      vehicleId: vehicle.id,
    };
    try {
      const response = await API.post('/api/v/disposal', data);
      history.push(`/fleet/vehicle/${vehicle.id}`);
      setLoading(false);

      toast.success('Job Card Has Been Disporsed Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error while Adding Job Card");
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div class="mb-3">
            <label class="form-label">Disposal Reason</label>
            <textarea
              type="text"
              class="form-control"
              autocomplete="off"
              value={disposalReason}
              onChange={(e) => setdisposalReason(e.target.value)}
              placeholder="Disposal Reason"
            />
          </div>
        </div>
        <div className="col-12">
          <div class="mb-3">
            <label class="form-label">Disposal Cost</label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              placeholder="Disposal Cost"
              value={disposalCost}
              onChange={(e) => setdisposalCost(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12">
          <div class="mb-3">
            <label class="form-label">Disposed By</label>
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              placeholder="Disposed By"
              value={disposedBy}
              onChange={(e) => setdisposedBy(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="div mt-3">
        <button class="btn btn-primary me-2" onClick={handleSubmit}>
          {loading ? <FNSpinner /> : "Dispose Vehicle"}
        </button>
        <button class="btn btn-outline-primary" onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddDisposal;
