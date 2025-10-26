import React, { useState, useEffect, Fragment } from "react";
import API from "../../../../helpers/api";
import VehicleInfo from "./VehicleInfo";
import Driver from "./Driver";
import Staff from "./Staff";
import ServiceRequests from "./ServiceRequests";
import VehicleJobCards from "./VehicleJobCards";
import Disposal from "./Disposal";

const VehicleDetails = ({ match }) => {
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = match.params;

  const getVehicle = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle/${id}`);
      console.log(res);
      setLoading(false);
      setVehicle(res.data.vehicle);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicle();
  }, []);

  return (
    <Fragment>
      <div class="row mb-3">
        <div class="col-12">
          <div class="d-sm-flex align-items-center justify-content-between">
            <h2>
              Vehicle Number Plate: {vehicle.old_number_plate} /{" "}
              {vehicle.new_number_plate
                ? vehicle.new_number_plate
                : "No New Plate"}
            </h2>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Manage Vehicle Details</h4>
              <ul class="nav nav-tabs nav-tabs-custom" role="tablist">
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link active"
                    data-bs-toggle="tab"
                    href="#vehicle"
                    role="tab"
                    aria-selected="true"
                  >
                    Vehicle Info
                  </a>
                </li>
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#driver"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Assigned Driver
                  </a>
                </li>
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#staff"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Assigned Staff
                  </a>
                </li>
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#services"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Service Requests
                  </a>
                </li>
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#jobcards"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Job Cards
                  </a>
                </li>
                {/* <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#service"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Garage Repairs
                  </a>
                </li> */}
                <li class="nav-item" role="presentation">
                  <a
                    class="nav-link"
                    data-bs-toggle="tab"
                    href="#vdisposal"
                    role="tab"
                    aria-selected="false"
                    tabindex="-1"
                  >
                    Vehicle Disposal
                  </a>
                </li>
              </ul>
              <div class="tab-content p-3">
                <VehicleInfo vehicle={vehicle} />
                <Driver id={id} vehicle={vehicle} />
                <Staff id={id} vehicle={vehicle} />
                <ServiceRequests vehicle={vehicle} />
                <VehicleJobCards vehicle={vehicle} />
                <Disposal  vehicle={vehicle}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default VehicleDetails;
