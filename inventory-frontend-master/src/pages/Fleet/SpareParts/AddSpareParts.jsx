import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";

const AddSpareParts = ({ close, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState();
  const [formData, setFormData] = useState({
    partname: "",
    partno: "",
    qty: "",
    measure: "",
    categoryId: "",
    unitPrice: "",
  });

  const categoryChange = (selectedOption) => {
    setFormData({ ...formData, categoryId: selectedOption.value });
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/sparecategory`);
      setCategories(res?.data.sparecategory);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      brand,
      qtyAvailable: formData.qty,
    };

    try {
      const response = await API.post("/v/sparepart", data);
      setLoading(false);
      close();
      refresh();
      toast.success(`Spare Part Has Been Added Successfully`);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error Encountered  While Adding Spare Part");
    }
  };

  const partBrands = ["Bosch", "Denso", "NGK", "Brembo", "KYB"];
  const options = partBrands.map((brand) => ({ value: brand, label: brand }));

  useEffect(() => {
    loadCategories();
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
                  <Select
                    defaultValue={formData.categoryId}
                    onChange={categoryChange}
                    options={categories.map((x) => ({
                      value: x.id,
                      label: x.name,
                    }))}
                    placeholder="Select Spare Part Category"
                  />
                </div>
              </div>

              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="kycselectcity-input" class="form-label">
                    Part Brand
                  </label>
                  {/* <Select
                    value={brand}
                    onChange={(selectedOption) =>
                      setBrand(selectedOption?.value)
                    } // react-select passes the full object to the handler
                    options={options} // Pass the options array here
                    placeholder="Select Part Brand"
                    isClearable
                  /> */}
                  <Select
                    value={
                      options.find((option) => option.value === brand) || null
                    } // Match the selected value to the options
                    onChange={(selectedOption) =>
                      setBrand(selectedOption?.value)
                    } // Update only with the value string
                    options={options} // Options array
                    placeholder="Select Part Brand"
                    isClearable
                  />
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

export default AddSpareParts;
