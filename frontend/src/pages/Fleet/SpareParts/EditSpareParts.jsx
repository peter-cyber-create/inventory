import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const EditSpareParts = ({ id, close, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partname: "",
    partno: "",
    qty: "",
    measure: "",
    category: "",
    unitPrice: "",
  });

  const loadSparePart = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/sparepart/${id}`);
      const sparePartData = res.data.sparepart;

      setFormData({
        partname: sparePartData.partname,
        partno: sparePartData.partno,
        qty: sparePartData.qty,
        measure: sparePartData.measure,
        category: sparePartData.category,
        unitPrice: sparePartData.unitPrice,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.patch(`/v/sparepart/${id}`, formData);
      setLoading(false);
      close();
      refresh();
      toast.success('Spare Part Has Been Added Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error Encountered  While Adding Spare Part");
    }
  };

  useEffect(() => {
    loadSparePart();
  }, []);

  return (
    <div class="card">
      <div class="card-body">
        <section
          id="kyc-verify-wizard-p-0"
          role="tabpanel"
          aria-labelledby="kyc-verify-wizard-h-0"
          class="body current"
          aria-hidden="false"
        >
          <form>
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycfirstname-input" class="form-label">
                    Spare Part Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Spare Part Name"
                    value={formData.partname}
                    onChange={(e) =>
                      setFormData({ ...formData, partname: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycselectcity-input" class="form-label">
                    Spare Part Number
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="kyclastname-input"
                    placeholder="Enter Spare Part Number"
                    value={formData.partno}
                    onChange={(e) =>
                      setFormData({ ...formData, partno: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycselectcity-input" class="form-label">
                    Spare Part Category
                  </label>
                  <select
                    class="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Select Spare Part Category</option>
                    <option value="Engine Oil">Engine Oil</option>
                    <option value="Oil Filter">Oil Filter</option>
                    <option value="Tires">Tires</option>
                    <option value="SparkPlugs">Spark Plugs</option>
                    <option value="Coolant">Coolant</option>
                    <option value="A/C Filter">A/C Filter</option>
                    <option value="Steering Fluid">Steering Fluid</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycselectcity-input" class="form-label">
                    Unit Price
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="kyclastname-input"
                    placeholder="Enter Unit Price"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycfirstname-input" class="form-label">
                    Spare Part Quantity
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Spare Part quantity"
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycselectcity-input" class="form-label">
                    Unit of Measure
                  </label>
                  <select
                    class="form-select"
                    value={formData.measure}
                    onChange={(e) =>
                      setFormData({ ...formData, measure: e.target.value })
                    }
                  >
                    <option>Select Unit of Measure</option>
                    <option value="Litres">Litres</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Units">Units</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
          <div className="actions clearfix">
            <button
              className="btn btn-primary waves-effect waves-light"
              onClick={handleSubmit}
              role="menuitem"
              style={{ cursor: "pointer" }}
            >
              {loading ? <FNSpinner /> : "Add Spare Part"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditSpareParts;
