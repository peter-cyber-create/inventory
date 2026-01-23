import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";

const AddSpareCategory = ({ close, refresh }) => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/api/v/sparecategory', formData);
      console.log(response)
      setLoading(false);
      close();
      refresh();
      toast.success('Spare Category Has Been Added Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error while Adding Spare Category");
    }
  };

  return (
    <div class="card custom-card">
      <div class="card-body">
        <section id="kyc-verify-wizard-p-0" role="tabpanel" aria-labelledby="kyc-verify-wizard-h-0" class="body current" aria-hidden="false">
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label for="kycselectcity-input" class="form-label">Spare Category Name</label>
                <input type="text" class="form-control" placeholder="Enter Spare Category Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  } />
              </div>
            </div>
          </div>
          <div className="actions clearfix">
            <button className="btn btn-primary waves-effect waves-light" onClick={handleSubmit} role="menuitem" style={{ cursor: 'pointer' }}>
              {loading ? <FNSpinner /> : "Add Spare Category"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AddSpareCategory