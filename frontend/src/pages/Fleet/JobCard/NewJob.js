// import { useState, useEffect, Fragment, useRef } from "react";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import { useHistory } from "react-router-dom";
// // import API from "../../../helpers/api";
// // import FNSpinner from "../../../components/FNSpinner";
// // import JobcardTop from "../../../assets/images/jobCard2.png";
// // import JobcardBottom from "../../../assets/images/jobcardFooter.png";
// // import AddSpare from "./AddSpare";
// import { LucideDownload } from "lucide-react";

// import API from "../../../helpers/api";
// import FNSpinner from "../../../components/FNSpinner";

// import React from "react";

// function CreateJobCard() {

//   return (

//   );
// }

// export default CreateJobCard;
import ReactToPrint from "react-to-print";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import API from "../../../helpers/api";
import { toast } from "react-toastify";
import Select from "react-select";
import { LucideDownload } from "lucide-react";
import FNSpinner from "../../../components/FNSpinner";
import AddSpare from "./AddSpare";
import VehicleTable from "./VehicleTable";
import AddJobCardSpare from "./AddJobCardSpare";

import createJobCardImage from "../../../assets/images/createJob.png";
const NewJob = () => {
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [repairedby, setRepairedBy] = useState("");
  const [testedby, setTestedBy] = useState("");
  const [date, setDate] = useState("");
  const [signature, setSignature] = useState("");
  const [worksdone, setWorksDone] = useState("");
  const [additionalworks, setAdditionalWorks] = useState("");
  const [rows, setRows] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [hasvat, setHasVat] = useState(false);
  const [hasdiscount, setHasDiscount] = useState(false);
  const [currency, setCurrency] = useState();
  ////NEW STATES

  const [timeIn, setTimeIn] = useState();
  const [technicianComment, setTechComment] = useState();
  const [defects, setDefects] = useState();
  const [dateIn, setDateIn] = useState();
  const [dateOut, setDateOut] = useState();
  const [timePromised, setTimePromised] = useState();
  const [serviceAdvisor, setServiceAdvisor] = useState();
  const [dateOfSale, setDateOfSale] = useState();
  const [dateOfDelivery, setDateOfDelivery] = useState();
  const [driverOrCustomerName, setDriverOrCustomerName] = useState();
  const [testorSignature, setTestorSignature] = useState();
  const [workshopManager, setWorkshopManager] = useState();
  const [dateClosed, setDateClosed] = useState();
  const [dateTested, setDateTested] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [selectedParts, setSelectedParts] = useState([]);

  const [items, setItems] = useState({
    removevaluables: false,
    radioWorking: false,
    cigarettelighter: false,
    enginewarninglights: false,
    radioinworkingorder: false,
    jack: false,
    jackhandle: false,
    sparetyre: false,
    floormarts: false,
    toolkit: false,
    hubcaps: false,
    fuele: false,
    fuel14: false,
    fuel12: false,
    fuel34: false,
    fuelf: false,
    fuelPlusOrMinus: false,
    yes: false,
    no: false,
    credit: false,
    cash: false,
    wheelSpanner: false,
  });

  const history = useHistory();

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setItems((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const loadVehicle = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle/all`);
      console.log("vehicles=====", res.data.vehicle);
      setVehicles(res?.data.vehicle);
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

  const handleChangeVehicle = (selectedOption) => {
    // console.log("selected vehicle ------", selectedOption)
    setVehicleId(selectedOption.value);
    fetchVehicleDetails(selectedOption.value);
  };

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
        jack: items.jack,
        wheelSpanner: items.wheelSpanner,
        windscreenDamage: items.yes ? "yes" : "no",
        paymentMethod: items.cash ? "Cash" : "Credit",
        fuele: items.fuele,
        fuelPlusOrMinus: items.fuelPlusOrMinus,
        fuelf: items.fuelf,
        workItems: rows,
        technicianComment,
        defects,
        dateIn,
        dateOut,
      },
      spare: selectedParts,
    };
    console.log("request Data====", requestData);
    try {
      const response = await API.post('/api/jobcards', requestData);
      requestData.spare.map((sp) =>
        updateSpareQty({ spareId: sp.value, qty: sp.qtyUsed })
      );
      setLoading(false);
      history.push("/fleet/jobcards");
      toast.success('Job Card Has Been Added Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error while Adding Job Card");
    }
  };

  const createNewRow = () => ({
    id: Date.now(),
    item: "",
    partno: "",
    qty: "",
    unitprice: "",
    serialno: "",
    amt: "",
  });

  const addRow = () => {
    setRows([...rows, createNewRow()]);
  };

  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          if (field === "qty" || field === "unitprice") {
            const qty =
              field === "qty"
                ? parseFloat(value) || 0
                : parseFloat(updatedRow.qty) || 0;
            const unitprice =
              field === "unitprice"
                ? parseFloat(value) || 0
                : parseFloat(updatedRow.unitprice) || 0;
            updatedRow.amt = qty * unitprice;
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const updateSpareQty = async ({ spareId, qty }) => {
    // setLoading(true);
    try {
      const res = await API.patch(`/v/sparepart/update/${spareId}`, {
        qty: qty,
      });
    } catch (error) {
      console.log("error", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicle();
  }, []);

  useEffect(() => {
    setRows([createNewRow()]);
  }, []);

  useEffect(() => {
    const calculateTotals = () => {
      const subTotal = rows.reduce(
        (total, row) => total + (parseFloat(row.amt) || 0),
        0
      );
      let discountAmount = 0;
      let netTotal = subTotal;
      let vatAmount = 0;
      let grossTotal = subTotal;

      if (hasdiscount) {
        discountAmount = (discount / 100) * subTotal;
        netTotal = subTotal - discountAmount;
      }

      if (hasvat) {
        vatAmount = netTotal * 0.18;
        grossTotal = netTotal + vatAmount;
      } else {
        grossTotal = netTotal;
      }

      setSubTotal(subTotal);
      setGrossTotal(grossTotal);
      setVat(vatAmount);
      setNetTotal(netTotal);
    };

    calculateTotals();
  }, [rows, discount, hasvat, hasdiscount]);

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
      jack: items.jack,
      wheelSpanner: items.wheelSpanner,
      windscreenDamage: items.yes ? "yes" : "no",
      paymentMethod: items.cash ? "Cash" : "Credit",
      fuele: items.fuele,
      fuelPlusOrMinus: items.fuelPlusOrMinus,
      fuelf: items.fuelf,
      workItems: rows,
      technicianComment,
      dateIn,
      dateOut,
    },
    spare: selectedParts,
  };

  console.log("selected part-s --------", vehicle);
  return (
    <>
      <div className="container-fluid " ref={componentRef}>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card bg-light border rounded shadow">
              <div className="card-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      {" "}
                      <>
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
                                  src={createJobCardImage}
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

                        <div className="card bg-transparent">
                          <div className="card-body">
                            <div class="row">
                              <div class="col-lg-4">
                                <div class="mb-3">
                                  <label
                                    for="kycselectcity-input"
                                    class="form-label"
                                  >
                                    Oild Number Plates
                                  </label>
                                  <Select
                                    className="bg-transparent bg-white"
                                    defaultValue={vehicleId}
                                    onChange={handleChangeVehicle}
                                    options={vehicles.map((vehicle) => ({
                                      value: vehicle.id,
                                      label: vehicle.old_number_plate,
                                    }))}
                                    placeholder="Select Vehicle  Number Plate"
                                  />
                                </div>
                              </div>

                              <div class="col-lg-4">
                                <div class="mb-3">
                                  <label
                                    for="kycselectcity-input"
                                    class="form-label"
                                  >
                                    New Number Plates
                                  </label>
                                  <Select
                                    className="bg-transparent bg-white"
                                    defaultValue={vehicleId}
                                    onChange={handleChangeVehicle}
                                    options={vehicles.map((vehicle) => ({
                                      value: vehicle.id,
                                      label: vehicle.new_number_plate,
                                    }))}
                                    placeholder="Select Vehicle  Number Plate"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <VehicleTable vehicle={vehicle} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="">
                          <AddJobCardSpare
                            selectedParts={selectedParts}
                            setSelectedParts={setSelectedParts}
                          />
                          {/* <AddSpare
                    selectedParts={selectedParts}
                    setSelectedParts={setSelectedParts}
                  /> */}
                        </div>

                        {/* <div className="card bg-secondary bg-opacity-10 p-3  text-secondary">
                  <p>
                    <strong className="">NOTE:</strong> While we strive to
                    provide the best service possible, please be advised that
                    any unforeseen issues that may arise during the maintenance
                    of your vehicle are not the responsibility of the service
                    provider. We recommend discussing any concerns or additional
                    services with our staff prior to commencing work on your
                    vehicle. Disclaimer: I hereby certify that I have legal
                    right to authorize repairs, road test, etc. I also hereby
                    confirm that I shall not hold SSEJP E&C, its Directors,
                    Employees and representatives liable for any damage beyond
                    their control which may arise during the repairs. By
                    authorizing the maintenance work, you acknowledge and accept
                    these terms.
                  </p>
                </div> */}

                        <div className="card bg-transparent p-2">
                          <div className="card-body">
                            <h4 className="py-3">
                              I did not leave any personal effects in my vehicle
                            </h4>
                            <div class="row">
                              <div class="col-8 mb-3">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label "
                                >
                                  Driver Name
                                </label>
                                <input
                                  type="text"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={driverOrCustomerName}
                                  onChange={(e) =>
                                    setDriverOrCustomerName(e.target.value)
                                  }
                                />
                              </div>
                              <div class="col-4">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label "
                                >
                                  Signature
                                </label>{" "}
                                <input
                                  type="text"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={signature}
                                  onChange={(e) => setSignature(e.target.value)}
                                  disabled
                                />
                              </div>
                              <div class="col-8 mb-3">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label "
                                >
                                  Garage Manager
                                </label>{" "}
                                <input
                                  type="text"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={workshopManager}
                                  onChange={(e) =>
                                    setWorkshopManager(e.target.value)
                                  }
                                />
                              </div>
                              <div class="col-4">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label"
                                >
                                  Signature
                                </label>{" "}
                                <input
                                  type="text"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={testorSignature}
                                  onChange={(e) =>
                                    setTestorSignature(e.target.value)
                                  }
                                  disabled
                                />
                              </div>

                              {/* <div class="col-6">
                                <div class="mb-3 row">
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
                                      value={dateClosed}
                                      onChange={(e) =>
                                        setDateClosed(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="mb-3 row">
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
                                      value={dateTested}
                                      onChange={(e) =>
                                        setDateTested(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div> */}

                              <div className="col-12">
                                <div className="row py-3 mb-3 bg-secondary bg-opacity-10 text-secondary rounded mb-2 py-3">
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
                                              checked={items.jack}
                                              onChange={handleCheckboxChange}
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
                                              checked={items.wheelSpanner} // Use checked to bind the value properly
                                              onChange={
                                                () =>
                                                  setItems({
                                                    ...items,
                                                    wheelSpanner:
                                                      !items.wheelSpanner,
                                                  }) // Toggles the value
                                              }
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
                                              checked={items.yes}
                                              onChange={handleCheckboxChange}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="yes"
                                            >
                                              Yes
                                            </label>
                                          </div>
                                          <div className="form-check form-checkbox-outline form-check-primary">
                                            <input
                                              className="form-check-input mx-1"
                                              type="checkbox"
                                              id="no"
                                              checked={items.no}
                                              onChange={handleCheckboxChange}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="no"
                                            >
                                              No
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="col-6">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label "
                                >
                                  Technician's Comments
                                </label>{" "}
                                <textarea
                                  type="text"
                                  rows="6"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={technicianComment}
                                  onChange={(e) => setTechComment(e.target.value)}
                                />
                              </div>
                              <div class="col-6">
                                <label
                                  for="kycselectcity-input"
                                  class="form-label "
                                >
                                  Defects Identified
                                </label>{" "}
                                <textarea
                                  type="text"
                                  rows="6"
                                  class="form-control bg-transparent"
                                  placeholder=""
                                  value={defects}
                                  onChange={(e) => setDefects(e.target.value)}
                                />
                              </div>

                              {/* <div class="col-4">
                                <div class="mb-3 row">
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
                                      value={dateIn}
                                      onChange={(e) =>
                                        setDateIn(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div class="col-4">
                                <div class="mb-3 row">
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
                                      value={dateOut}
                                      onChange={(e) =>
                                        setDateOut(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div className="col-12">
                      <div className="card bg-transparent">
                        <div className="card-body">
                          <div className="float-end">
                            {/* <ReactToPrint
                trigger={() => (
                  <button class="btn btn-lg btn-warning  me-3  w-md waves-effect waves-light">
                    <LucideDownload /> Print Job Card Offline
                  </button>
                )}
                content={() => componentRef.current}
              /> */}
                            <button
                              onClick={handleSubmit}
                              className="btn btn-primary w-md waves-effect waves-light"
                            >
                              {loading ? <FNSpinner /> : "Add Job Card Details"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewJob;
