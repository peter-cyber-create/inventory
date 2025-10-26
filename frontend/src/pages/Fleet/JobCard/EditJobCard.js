"use client";

import { useState, useEffect } from "react";
import API from "../../../helpers/api";
// import Jobcard from "./jobcard.png";
import FNSpinner from "../../../components/FNSpinner";
import Select from "react-select";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import EditSpare from "./EditSpare";
import VehicleTable from "./VehicleTable";
import AddJobCardSpare from "./AddJobCardSpare";
import jodcardEditImage from "../../../assets/images/updateJob.png";
export default function EditJobCard({ match }) {
  const { id } = match.params;
  const [jobCard, setJobCard] = useState([]);
  const [jobCardId, setJobCardId] = useState();
  const [jobCardSpare, setJobCardSpare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);

  const [vehicleId, setVehicleId] = useState(jobCard?.vehicleId);
  const [date, setDate] = useState(jobCard?.date || "");
  const [timeIn, setTimeIn] = useState(jobCard?.timeIn || "");
  const [timePromised, setTimePromised] = useState(jobCard?.timePromised || "");
  const [currency, setCurrency] = useState(jobCard?.currency);
  const [serviceAdvisor, setServiceAdvisor] = useState(
    jobCard?.serviceAdvisor || ""
  );
  const [dateOfSale, setDateOfSale] = useState(jobCard?.dateOfSale || "");
  const [dateOfDelivery, setDateOfDelivery] = useState(
    jobCard?.dateOfDelivery || ""
  );
  const [driverOrCustomerName, setDriverOrCustomerName] = useState(
    jobCard?.driverOrCustomerName || ""
  );
  const [signature, setSignature] = useState(jobCard?.signature || "");
  const [testorSignature, setTestorSignature] = useState(
    jobCard?.testorSignature || ""
  );
  const [workshopManager, setWorkshopManager] = useState(
    jobCard?.workshopManager || ""
  );
  const [dateClosed, setDateClosed] = useState(jobCard?.dateClosed || "");
  const [dateTested, setDateTested] = useState(jobCard?.dateTested || "");
  const [jack, setJack] = useState(jobCard?.jack || false);
  const [wheelSpanner, setWheelSpanner] = useState(
    jobCard?.wheelSpanner || false
  );
  const [windscreenDamage, setWindscreenDamage] = useState(
    jobCard?.windscreenDamage || ""
  );
  const [paymentMethod, setPaymentMethod] = useState(jobCard?.paymentMethod);
  const [fuele, setFuele] = useState(jobCard?.fuele || "");
  const [fuelPlusOrMinus, setFuelPlusOrMinus] = useState(
    jobCard?.fuelPlusOrMinus || ""
  );
  const [fuelf, setFuelf] = useState(jobCard?.fuelf || "");
  const [workItems, setWorkItems] = useState(jobCard?.workItems || []);

  const fetchJobCard = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/jobcards/${id}`);
      // console.log("Job Cards ===>", res);
      const job = res?.data.job || {};
      loadVehicles();
      fetchVehicleDetails(job.vehicle.id);
      setJobCard(job);

      setVehicleId(job.vehicleId);
      setDate(job.date);
      setTimeIn(job.timeIn);
      setTimePromised(job.timePromised);
      setCurrency(job.currency);
      setServiceAdvisor(job.serviceAdvisor);
      setDateOfSale(job.dateOfSale);
      setDateOfDelivery(job.dateOfDelivery);
      setDriverOrCustomerName(job.driverOrCustomerName);
      setSignature(job.signature);
      setTestorSignature(job.testorSignature);
      setWorkshopManager(job.workshopManager);
      setDateClosed(job.dateClosed);
      setDateTested(job.dateTested);
      setJack(job.jack);
      setWheelSpanner(job.wheelSpanner);
      setWindscreenDamage(job.windscreenDamage);
      setPaymentMethod(job.paymentMethod);
      setFuele(job.fuele);
      setFuelPlusOrMinus(job.fuelPlusOrMinus);
      setFuelf(job.fuelf);
      setJobCardId(job.id);

      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle/all`);
      console.log(res);
      setVehicles(res?.data.vehicle);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  const handleChangeVehicle = (selectedOption) => {
    setVehicleId(selectedOption.value);
    fetchVehicleDetails(selectedOption.value);
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

  const loadSpareQty = async ({ spareId }) => {
    try {
      const res = await API.get(`/v/sparepart/qty/${spareId}`);
      return res.data.qty;
    } catch (error) {
      console.error("Error fetching spare quantity:", error);
      return 0; // Return a default value in case of an error
    }
  };

  const loadJobCardSpare = async () => {
    try {
      const res = await API.get(`/jobcard/spare/${id}`);
      console.log("-----job spare", res?.data?.spareparts);

      setJobCardSpare(res?.data?.spareparts || []);

      // Resolve all spare quantities asynchronously
      const partsWithQty = await Promise.all(
        res?.data?.spareparts.map(async (job) => {
          const spareQty = await loadSpareQty({ spareId: job.spareId }); // Wait for the promise to resolve
          console.log("spareQty===--===", spareQty);
          return {
            key: job.id,
            value: job.spareId,
            label: job.partname,
            unitPrice: job.unitPrice,
            qtyUsed: job.qtyUsed,
            qtyAvailable: spareQty, // Use the resolved spare quantity here
            qty: spareQty,
            partno: job.partno,
            partname: job.partname,
            measure: job.measure,
          };
        })
      );

      setSelectedParts((old) => [...partsWithQty]); // Update state with the resolved parts
    } catch (error) {
      console.error("Error fetching job card spares:", error);
    }
  };

  // useEffect(() => {
  //   fetchJobCard();
  // }, [id]);

  useEffect(() => {
    if (id) {
      fetchJobCard();
      loadJobCardSpare();
    }
  }, []);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      data: {
        vehicleId,
        date,
        timeIn,
        timePromised,
        currency,
        serviceAdvisor,
        dateOfSale,
        dateOfDelivery,
        driverOrCustomerName,
        signature,
        testorSignature,
        workshopManager,
        dateClosed,
        dateTested,
        jack,
        wheelSpanner,
        windscreenDamage,
        paymentMethod,
        fuele,
        fuelPlusOrMinus,
        fuelf,
      },
      jobCardId,
      spare: selectedParts,
    };
    console.log("request Data====", requestData);
    try {
      const response = await API.patch(`/jobcards/${id}`, requestData);
      setLoading(false);
      history.push("/jobcard/view");
      toast.success(`Job Card Has Been Updated Successfully`);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error while Updating Job Card");
    }
  };

  console.log("....select-spare", jobCardSpare);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card bg-transparent shadow-0">
            <div className="card-body">
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="d-sm-flex mb-4">
                      <div
                        style={{
                          width: "100%",
                          height: "20vh",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={jodcardEditImage}
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
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label for="kycselectcity-input" class="form-label">
                        Select Old Vehicle Number Plate
                      </label>
                      <Select
                        defaultValue={vehicleId}
                        onChange={handleChangeVehicle}
                        options={vehicles?.map((vehicle) => ({
                          value: vehicle.id,
                          label: vehicle.old_number_plate,
                        }))}
                        placeholder={jobCard?.vehicle?.old_number_plate}
                      />
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label for="kycselectcity-input" class="form-label">
                        Select New Vehicle Number Plate
                      </label>
                      <Select
                        defaultValue={vehicleId}
                        onChange={handleChangeVehicle}
                        options={vehicles?.map((vehicle) => ({
                          value: vehicle.id,
                          label: vehicle.new_number_plate,
                        }))}
                        placeholder={jobCard?.vehicle?.new_number_plate}
                      />
                    </div>
                  </div>
                </div>

                <div className="card bg-transparent">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div class="table-responsive">
                          <VehicleTable vehicle={vehicle} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-transparent">
                  <div className="card-body">
                    <h4 className="py-3">
                      I did not leave any personal effects in my vehicle
                    </h4>
                    <div class="row">
                      <div class="col-6">
                        <div class=" row">
                          <div className="col-3">
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Driver or Customer Name
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="text"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.driverOrCustomerName}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class=" row">
                          <div className="col-3">
                            {" "}
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Signature
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="text"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.signature}
                              // onChange={handleInputChange}
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
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.testorSignature}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class=" row">
                          <div className="col-3">
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Workshop Manager
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="text"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.workshopManager}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class=" row">
                          <div className="col-3">
                            {" "}
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Date Closed
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="date"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.dateClosed}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-6 mb-3">
                        <div class=" row">
                          <div className="col-3">
                            {" "}
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Date of Tested
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="date"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.dateTested}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="row bg-secondary bg-opacity-10 text-secondary py-3 mb-3 align-items-center">
                          <div class="col-6">
                            <div class=" row">
                              <div className="col-12">
                                <div className="d-flex flex-row me-3">
                                  <label className="me-2">Tools:</label>
                                  <div className="form-check form-checkbox-outline form-check-primary mb-2">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="jack"
                                      checked={jobCard?.jack}
                                      // onChange={handleInputChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="jack"
                                    >
                                      Jack
                                    </label>
                                  </div>
                                  <div className="form-check form-checkbox-outline form-check-success">
                                    <input
                                      className="form-check-input mx-1"
                                      type="checkbox"
                                      id="wheelspanner"
                                      // checked={items.wheelSpanner} // Use checked to bind the value properly
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
                            <div class=" row">
                              <div className="col-12">
                                {" "}
                                <div className="d-flex flex-row me-5">
                                  <label className="me-2">
                                    Windscreen Damage:
                                  </label>
                                  <div className="form-check form-checkbox-outline form-check-primary">
                                    <input
                                      className="form-check-input mx-1"
                                      type="checkbox"
                                      id="yes"
                                      checked={jobCard?.windscreenDamage}
                                      // onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-4">
                        <div class=" row">
                          <div className="col-3">
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Technician's Name
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="text"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.technicianName}
                              // onChange={handleInputChange}
                              // onChange={(e) => setTechName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-4">
                        <div class=" row">
                          <div className="col-3">
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Date In
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="date"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.dateIn}
                              // onChange={handleInputChange}
                              // onChange={(e) => setDateIn(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-4">
                        <div class=" row">
                          <div className="col-3">
                            <label
                              for="kycselectcity-input"
                              class="form-label "
                            >
                              Date Out:
                            </label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <input
                              type="date"
                              class="form-control bg-transparent"
                              placeholder=""
                              value={jobCard?.dateOut}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="">
                      <div className="">
                        <AddJobCardSpare
                          selectedParts={selectedParts}
                          setSelectedParts={setSelectedParts}
                        />
                        {/* <EditSpare
              selectedParts={selectedParts}
              setSelectedParts={setSelectedParts}
              refresh={loadJobCardSpare}
            /> */}

                        <div className="float-end">
                          <button
                            onClick={handleSubmit}
                            className="btn btn-primary w-md waves-effect waves-light"
                          >
                            {loading ? (
                              <FNSpinner />
                            ) : (
                              "Update Job Card Details"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
