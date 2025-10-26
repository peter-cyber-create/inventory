import React from "react";

const VehicleInfo = ({ vehicle }) => {
  return (
    <div class="tab-pane active" id="vehicle" role="tabpanel">
      <div className="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              {/* <h4 class="card-title">Table Border color</h4>
                                        <p class="card-title-desc">Add <code>.table-bordered</code> &amp; <code>.border-*</code> for colored borders on all sides of the table and cells.</p>     */}

              <div class="table-responsive">
                <table class="table table-bordered border-primary mb-0">
                  <tbody>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Old Number Plate
                      </th>
                      <td>{vehicle.old_number_plate}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        New Number Plate
                      </th>
                      <td>{vehicle.new_number_plate}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Type
                      </th>
                      <td>{vehicle.type}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Make
                      </th>
                      <td>{vehicle.make}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Chassis No
                      </th>
                      <td>{vehicle.chassis_no}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Engine No
                      </th>
                      <td>{vehicle.engine_no}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        YOM
                      </th>
                      <td>{vehicle.YOM}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Fuel
                      </th>
                      <td>{vehicle.fuel}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Engine CC
                      </th>
                      <td>{vehicle.power}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Total Cost
                      </th>
                      <td>{vehicle.total_cost}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Country of Origin
                      </th>
                      <td>{vehicle.country_of_origin}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        User Department
                      </th>
                      <td>{vehicle.user_department}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Officer
                      </th>
                      <td>{vehicle.officer}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Driver
                      </th>
                      <td>{vehicle.driver}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Contact
                      </th>
                      <td>{vehicle.contact}</td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Mileage
                      </th>
                      <td>{vehicle.mileage}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Sticker No
                      </th>
                      <td>{vehicle.sticker_no}</td>
                      <th scope="row" style={{ backgroundColor: "#f2f2f2" }}>
                        Age
                      </th>
                      <td>{vehicle.age}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
