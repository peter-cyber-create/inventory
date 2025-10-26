import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import API from "../../../../helpers/api";
import FNSpinner from "../../../../components/FNSpinner";
import HistoryDetails from "./HistoryDetails";

const ServiceHistory = () => {
  const [vehicle, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [licensePlate, setLicensePlate] = useState("");

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await API.get("/vehicle");
      setVehicles(res?.data.assets);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <Fragment>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Vehicle Service History Report</h4>
            {/* <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"></li>
                                <li class="breadcrumb-item active">Listing</li>
                            </ol>
                        </div> */}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row mb-2">
                    <div class="col-sm-4">
                      <label class="form-label">
                        Select Vehicle Number Plate
                      </label>
                      <select
                        class="form-select"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                      >
                        <option>Select Vehicle Number Plate</option>
                        {vehicle.length > 0 &&
                          vehicle.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.licensePlate}
                            </option>
                          ))}
                      </select>
                      {/* <Select
                                                options={vehicle}
                                                value={licensePlate}
                                                onChange={(e) => setLicensePlate(e.target.value)}
                                                placeholder="Select Vehicle Number Plate"
                                                isSearchable
                                            /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HistoryDetails id={licensePlate} />
    </Fragment>
  );
};

export default ServiceHistory;
