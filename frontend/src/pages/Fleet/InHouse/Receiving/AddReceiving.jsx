import React, { useEffect, useState } from "react";
import { Form, Card, Container, Row, Col, Button } from "react-bootstrap";
import receiveImage from "../../../../assets/images/receiving.png";
import API from "../../../../helpers/api";
import VehicleTable from "../../JobCard/VehicleTable";
import Select from "react-select";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GarageServicingForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState();
  const [loading, setLoading] = useState();
  const [vehicleId, setVehicleId] = useState(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    vehicleId,
    transportOfficer: "",
    date: "",
    time: "",
    vehicleReg: "",
    driverName: "",
    mileage: "",
    battery: false,
    radiator: false,
    engineOil: false,
    brakes: false,
    tires: false,
    lights: false,
    steering: false,
    clutch: false,
    gearbox: false,
    differential: false,
    propeller: false,
    waterLevel: false,
    remarks: "",
    userSignature: "",
    acceptedBy: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/api/v/receive', formData);
      setLoading(false);

      toast.success('Vehicle Successfully Received in Garage');
      history.push("/fleet/receiving");
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error while Receiving Vehicle in Garage");
    }
    // console.log("Form submitted:", formData);
  };

  const loadVehicle = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle`);
      console.log(res);
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
    // setVehicleId(selectedOption.value);

    setFormData((prevState) => ({
      ...prevState,
      vehicleId: selectedOption.value,
    }));
    fetchVehicleDetails(selectedOption.value);
  };
  useEffect(() => {
    loadVehicle();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card bg-light border rounded shadow">
            <div className="card-body">
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
                        src={receiveImage}
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
              <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Basic Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group controlId="transportOfficer">
                          <Form.Label className="text-uppercase small fw-bold">
                            Transport Officer:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="transportOfficer"
                            value={formData.transportOfficer}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="date">
                          <Form.Label className="text-uppercase small fw-bold">
                            Date:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="time">
                          <Form.Label className="text-uppercase small fw-bold">
                            Time:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group controlId="oldRegistrationNo">
                          <div class="mb-3">
                            <label for="kycselectcity-input" class="form-label">
                              Old Number Plates
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
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="newRegistrationNo">
                          <div class="mb-3">
                            <label for="kycselectcity-input" class="form-label">
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
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="mileage">
                          <Form.Label className="text-uppercase small fw-bold">
                            Mileage:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="number"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={12}>
                        <VehicleTable vehicle={vehicle} />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Vehicle Systems Check */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Vehicle Systems Check
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="battery"
                            label="Battery"
                            name="battery"
                            checked={formData.battery}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="radiator"
                            label="Radiator"
                            name="radiator"
                            checked={formData.radiator}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="engineOil"
                            label="Engine Oil"
                            name="engineOil"
                            checked={formData.engineOil}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="brakes"
                            label="Brakes"
                            name="brakes"
                            checked={formData.brakes}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="tires"
                            label="Tires"
                            name="tires"
                            checked={formData.tires}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="lights"
                            label="Lights"
                            name="lights"
                            checked={formData.lights}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="steering"
                            label="Steering"
                            name="steering"
                            checked={formData.steering}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="clutch"
                            label="Clutch"
                            name="clutch"
                            checked={formData.clutch}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="gearbox"
                            label="Gearbox"
                            name="gearbox"
                            checked={formData.gearbox}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="differential"
                            label="Differential"
                            name="differential"
                            checked={formData.differential}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="propeller"
                            label="Propeller"
                            name="propeller"
                            checked={formData.propeller}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="waterLevel"
                            label="Water Level"
                            name="waterLevel"
                            checked={formData.waterLevel}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Remarks */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Remarks</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Control
                        className="bg-transparent"
                        as="textarea"
                        rows={3}
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        placeholder="Enter any additional remarks or service instructions"
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Signatures */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Signatures</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="userSignature">
                          <Form.Label className="text-uppercase small fw-bold">
                            Signature of User:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="userSignature"
                            disabled
                            placeholder="For physical signature"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="acceptedBy">
                          <Form.Label className="text-uppercase small fw-bold">
                            Accepted By:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="acceptedBy"
                            disabled
                            placeholder="For physical signature"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button variant="primary" type="submit" size="lg">
                    Submit Form
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageServicingForm;

// import React, { useState, useEffect, Fragment } from "react";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import API from "../../../../helpers/api";
// import FNSpinner from "../../../../components/FNSpinner";

// const AddReceiving = ({ close, refresh }) => {
//   const [loading, setLoading] = useState(false);
//   const [receivedBy, setReceivedBy] = useState("");
//   const [contactName, setContactName] = useState("");
//   const [phoneNo, setPhoneNo] = useState("");
//   const [funding, setFunding] = useState("");
//   const [vehicles, setVehicles] = useState([]);
//   const [instruction, setInstruction] = useState("");
//   const [tools, setSelectedTools] = useState([]);
//   const [vehicleId, setVehicleId] = useState("");

//   const handleChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedTools([...tools, value]);
//     } else {
//       setSelectedTools(tools.filter((val) => val !== value));
//     }
//   };

//   const handleChangeVehicle = (selectedOption) => {
//     setVehicleId(selectedOption.value);
//   };

//   const loadVehicle = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(`/v/service/recieved`);
//       console.log(res);
//       setVehicles(res?.data.garage);
//       setLoading(false);
//     } catch (error) {
//       console.log("error", error);
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = {
//       receivedBy,
//       contactName,
//       phoneNo,
//       vehicleId,
//       funding,
//       instruction,
//       tools,
//       inGarage: true,
//     };

// try {
//   const response = await API.post('/api/v/receive', data);
//   setLoading(false);
//   close();
//   refresh();
//   toast.success('Vehicle Successfully Received in Garage');
// } catch (error) {
//   console.log("error", error);
//   setLoading(false);
//   toast.error("Error while Receiving Vehicle in Garage");
// }
//   };

//   useEffect(() => {
//     loadVehicle();
//   }, []);

//   return (
//     <Fragment>
//       <section
//         id="kyc-verify-wizard-p-0"
//         role="tabpanel"
//         aria-labelledby="kyc-verify-wizard-h-0"
//         class="body current"
//         aria-hidden="false"
//       >
//         <form>
//           <div className="row">
//             <div class="col-lg-6">
//               <div class="mb-3">
//                 <label class="form-label">Select Vehicle Received</label>
//                 <Select
//                   defaultValue={vehicleId}
//                   onChange={handleChangeVehicle}
//                   options={vehicles.map((veh) => ({
//                     value: veh.vehicle.id,
//                     label: veh.vehicle.old_number_plate || veh.vehicle.new_number_plate,
//                   }))}
//                   placeholder="Select Vehicle Number Plate"
//                 />
//               </div>
//             </div>
//             <div class="col-lg-6">
//               <div class="mb-3">
//                 <label for="kycfirstname-input" class="form-label">
//                   Received By
//                 </label>
//                 <input
//                   type="text"
//                   class="form-control"
//                   id="kycfirstname-input"
//                   placeholder=""
//                   value={receivedBy}
//                   onChange={(e) => setReceivedBy(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col-lg-6">
//               <div class="mb-">
//                 <label for="kycfirstname-input" class="form-label">
//                   Contact Person
//                 </label>
//                 <input
//                   type="text"
//                   class="form-control"
//                   id="kycfirstname-input"
//                   placeholder=""
//                   value={contactName}
//                   onChange={(e) => setContactName(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div class="col-lg-6">
//               <div class="mb-3">
//                 <label for="kyclastname-input" class="form-label">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   class="form-control"
//                   id="kyclastname-input"
//                   placeholder=""
//                   value={phoneNo}
//                   onChange={(e) => setPhoneNo(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col-lg-12">
//               <div class="mb-3">
//                 <label for="kyclastname-input" class="form-label">
//                   Funding Line
//                 </label>
//                 import Select from 'react-select';
//                 <Select
//                   defaultValue={{ value: funding, label: funding }} // Set default value if available
//                   onChange={(selectedOption) =>
//                     setFunding(selectedOption.value)
//                   } // Handle change to update state
//                   options={[
//                     { value: "Global Fund", label: "Global Fund" },
//                     { value: "UREEP", label: "UREEP" },
//                     { value: "GOU", label: "GOU" },
//                   ]}
//                   placeholder="Select funding source" // Optional: Customize the placeholder text
//                 />
//               </div>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col-lg-12">
//               <div class="mb-3">
//                 <label for="kycfirstname-input" class="form-label">
//                   Select Tools in Vehicle
//                 </label>
//                 <div class="d-flex">
//                   <label class="form-check font-size-1 mr-3">
//                     <input
//                       class="form-check-input mr-5"
//                       type="checkbox"
//                       value="spare wheel"
//                       onChange={handleChange}
//                     />
//                     <h5 class="text-truncate font-size-14 m-0">
//                       <span class="text-dark">Spare Wheel</span>
//                     </h5>
//                   </label>
//                   <label class="form-check font-size-1 ml-3">
//                     <input
//                       class="form-check-input mr-5"
//                       type="checkbox"
//                       value="wheel spanner"
//                       onChange={handleChange}
//                     />
//                     <h5 class="text-truncate font-size-14 m-0">
//                       <span class="text-dark">Wheel Spanner</span>
//                     </h5>
//                   </label>
//                   <label class="form-check font-size-1 mr-3">
//                     <input
//                       class="form-check-input mr-5"
//                       type="checkbox"
//                       value="extra wheel"
//                       onChange={handleChange}
//                     />
//                     <h5 class="text-truncate font-size-14 m-0">
//                       <span class="text-dark">Extra Wheel</span>
//                     </h5>
//                   </label>
//                   <label class="form-check font-size-1 mr-3">
//                     <input
//                       class="form-check-input mr-5"
//                       type="checkbox"
//                       value="radio"
//                       onChange={handleChange}
//                     />
//                     <h5 class="text-truncate font-size-14 m-0">
//                       <span class="text-dark">Radio</span>
//                     </h5>
//                   </label>
//                   <label class="form-check font-size-1 mr-3">
//                     <input
//                       class="form-check-input mr-5"
//                       type="checkbox"
//                       value="interior marts"
//                       onChange={handleChange}
//                     />
//                     <h5 class="text-truncate font-size-14 m-0">
//                       <span class="text-dark">Interior Marts</span>
//                     </h5>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="row">
//             <div class="col-lg-12">
//               <div class="mb-3">
//                 <label for="kycfirstname-input" class="form-label">
//                   Service Instruction
//                 </label>
//                 <textarea
//                   type="text"
//                   class="form-control"
//                   id="kycfirstname-input"
//                   placeholder=""
//                   rows="4"
//                   value={instruction}
//                   onChange={(e) => setInstruction(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="actions clearfix">
//             <button
//               className=" btn btn-primary"
//               onClick={handleSubmit}
//               style={{ cursor: "pointer" }}
//             >
//               {loading ? <FNSpinner /> : "Add Garage Car Receiving"}
//             </button>
//           </div>
//         </form>
//       </section>
//     </Fragment>
//   );
// };

// export default AddReceiving;
