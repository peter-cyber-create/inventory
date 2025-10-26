import React, { useEffect, useState } from "react";
import API from "../../../helpers/api";
import VehicleTable from "./VehicleTable";
import JobImage from "../../../assets/images/JobCard.png";

function JobCardData({ id, image }) {
  const [jobcard, setJobCard] = useState();
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState(false);
  const [spareParts, setSparePart] = useState([]);

  const loadJobCard = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/jobcards/${id}`);
      await fetchVehicleDetails(res?.data.job.vehicleId);
      await loadSpareParts();
      setJobCard(res?.data.job);

      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async (id) => {
    try {
      const res = await API.get(`/v/vehicle/${id}`);
      console.log(res);
      setVehicle(res?.data.vehicle);
    } catch (error) {
      console.log("Error fetching vehicle details", error);
    }
  };

  const loadSpareParts = async () => {
    // setLoading(true);
    try {
      const res = await API.get(`/jobcard/spare/${id}`);
      //   console.log("spare====", res?.data?.spareparts);
      setSparePart(res?.data?.spareparts);
      // setLoading(false);
    } catch (error) {
      console.log("error", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadJobCard();
    }
  }, []);
  console.log("==---===---", jobcard);
  return (
    <>
      {/* <div className="row">
        <div className="col-md-12"> */}{" "}
      {/* <div className="row">
            <div className="col-12">
              <div className="d-sm-flex align-items-center justify-content-between mb-3">
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="javascript: void(0);">Garage</a>
                    </li>
                    <li className="breadcrumb-item active">Job Card</li>
                  </ol>
                </div>
              </div>
            </div>
          </div> */}
      <div className="card border-opacity-0 bg-transparent">
        <div className="card-body bg-opacity-0">
        <div className="row">
                          <div className="col-12">
                            <div className="d-sm-flex mb-3">
                              <div
                                style={{
                                  width: "100%",
                                  // height: "20vh",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={JobImage}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
          <div class="row">
            <div class="col-lg-4">
              <div class="mb-3">
                {/* <h5>(
                  {jobcard?.vehicle?.old_number_plate ||
                    jobcard?.vehicle?.new_number_plate}
                  )
                </h5> */}
                {/* <label for="kycselectcity-input" class="form-label">
                  Vehicle Number Plate ({jobcard?.vehicle?.numberplate})
                </label> */}
                {/* <Select
                  // defaultValue={vehicleId}
                  // onChange={handleChangeVehicle}
                  // options={vehicles.map((vehicle) => ({
                  //   value: vehicle.id,
                  //   label: vehicle.numberplate,
                  // }))}
                  placeholder={jobcard?.vehicle?.numberplate}
                /> */}
              </div>
            </div>
            {/* <div class="col-lg-3">
              <div class="mb-3">
                <label for="kycselectcity-input" class="form-label">
                  Currency
                </label>
                <select
                  class="form-select"
                  aria-label="Select example"
                  value={jobcard?.currency}
                  disabled
                  // onChange={(e) => setCurrency(e.target.value)}
                >
                  <option>Select Currency </option>
                  <option>UGX</option>
                  <option>USD</option>
                  <option>EURO</option>
                  <option>KES</option>
                </select>
              </div>
            </div> */}
          </div>
          <div className="row">
            <div className="col-12">
              <div class="table-responsive">
                {/* <h5 className="">Vehicle Details</h5> */}
                <VehicleTable vehicle={vehicle} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="card bg-secondary bg-opacity-10 p-3  text-secondary">
            <p>
              <strong className="">NOTE:</strong> While we strive to provide the
              best service possible, please be advised that any unforeseen
              issues that may arise during the maintenance of your vehicle are
              not the responsibility of the service provider. We recommend
              discussing any concerns or additional services with our staff
              prior to commencing work on your vehicle. Disclaimer: I hereby
              certify that I have legal right to authorize repairs, road test,
              etc. I also hereby confirm that I shall not hold SSEJP E&C, its
              Directors, Employees and representatives liable for any damage
              beyond their control which may arise during the repairs. By
              authorizing the maintenance work, you acknowledge and accept these
              terms.
            </p>
          </div> */}
      <div className="card bg-transparent">
        <div className="card-body bg-opacity-0">
          <h4 className="py-3">
            I did not leave any personal effects in my vehicle
          </h4>
          <div class="row">
            <div class="col-6">
              <div class="mb-3 row">
                <div className="col-3">
                  <label for="kycselectcity-input" class="form-label ">
                    Driver or Customer Name
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.driverOrCustomerName}
                    // onChange={(e) =>
                    //   setDriverOrCustomerName(e.target.value)
                    // }
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3 row">
                <div className="col-3">
                  {" "}
                  <label for="kycselectcity-input" class="form-label ">
                    Signature
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.signature}
                    // value={jobcard?.signature}
                    // onChange={(e) => setSignature(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-2 row">
                <div className="col-3">
                  {" "}
                  <label for="kycselectcity-input" class="form-label">
                    Testor Signature
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.testorSignature}
                    // value={jobcard?.testorSignature}
                    // onChange={(e) =>
                    //   setTestorSignature(e.target.value)
                    // }
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3 row">
                <div className="col-3">
                  <label for="kycselectcity-input" class="form-label ">
                    Workshop Manager
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.workshopManager}
                    // value={jobcard?.workshopManager}
                    // onChange={(e) =>
                    //   setWorkshopManager(e.target.value)
                    // }
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3 row">
                <div className="col-3">
                  {" "}
                  <label for="kycselectcity-input" class="form-label ">
                    Date Closed
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.dateClosed}
                    // value={jobcard?.dateClosed}
                    // onChange={(e) => setDateClosed(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-3 row">
                <div className="col-3">
                  {" "}
                  <label for="kycselectcity-input" class="form-label ">
                    Date of Tested
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.dateTested}
                    // value={jobcard?.dateTested}
                    // onChange={(e) => setDateTested(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row  mb-2 py-3" style={{
                backgroundColor: "",
                color: ""
              }}>
                <div class="col-6">
                  <div class="mb-3 row">
                    <div className="col-12">
                      <div className="d-flex flex-row me-3">
                        <label className="me-2">Tools:</label>
                        <div className="form-check form-checkbox-outline form-check-primary mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="jack"
                            checked={jobcard?.jack}
                            // onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="jack">
                            Jack
                          </label>
                        </div>
                        <div className="form-check form-checkbox-outline form-check-success">
                          <input
                            className="form-check-input mx-1"
                            type="checkbox"
                            id="wheelspanner"
                            checked={jobcard?.wheelSpanner} // Use checked to bind the value properly
                            // onChange={
                            //   () =>
                            //     setItems({
                            //       ...items,
                            //       wheelSpanner: !items.wheelSpanner,
                            //     }) // Toggles the value
                            // }
                          />

                          <label
                            className="form-check-label"
                            htmlFor="wheelspanner"
                          >
                            Wheelspanner
                          </label>
                        </div>
                      </div>

                      {/* Fuel Group */}
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3 row">
                    <div className="col-12">
                      {" "}
                      <div className="d-flex flex-row me-5">
                        <label className="me-2">Windscreen Damage:</label>
                        <div className="form-check form-checkbox-outline form-check-primary">
                          <input
                            className="form-check-input mx-1"
                            type="checkbox"
                            id="yes"
                            checked={jobcard?.windscreenDamage}
                            // onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="yes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-checkbox-outline form-check-primary">
                          <input
                            className="form-check-input mx-1"
                            type="checkbox"
                            id="no"
                            checked={jobcard?.windscreenDamage}
                            // onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="no">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3 row">
                    <div className="col-12">
                      {" "}
                      <div className="d-flex flex-row me-5">
                        <label className="me-2">Other Damage:</label>
                        <div className="form-check form-checkbox-outline form-check-primary">
                          <input
                            className="form-check-input mx-1"
                            type="checkbox"
                            id="yes"
                            // checked={items.yes}
                            // onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="yes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-checkbox-outline form-check-primary">
                          <input
                            className="form-check-input mx-1"
                            type="checkbox"
                            id="no"
                            // checked={items.no}
                            // onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor="no">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3 row ">
                    <div className="col-12">
                      {/* Payment Method Group */}
                      <div className="d-flex flex-row">
                        <label className="me-2">Payment Method:</label>

                        {jobcard?.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class=" row">
                <div className="col-3">
                  <label for="kycselectcity-input" class="form-label ">
                    Technician's Name
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.technicianName}
                    // value={technicianName}
                    // onChange={(e) => setTechName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class="mb-3 row">
                <div className="col-3">
                  <label for="kycselectcity-input" class="form-label ">
                    Date In
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.dateIn}
                    // value={jobcard?.dateIn}
                    // onChange={(e) => setDateIn(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class="mb-3 row">
                <div className="col-3">
                  <label for="kycselectcity-input" class="form-label ">
                    Date Out:
                  </label>
                </div>
                <div className="col-6">
                  {" "}
                  <input
                    type="text"
                    class="form-control bg-transparent "
                    placeholder={jobcard?.dateOut}
                    // value={jobcard?.dateOut}
                    // onChange={(e) => setDateOut(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div>
      </div> */}
    </>
  );
}

export default JobCardData;
