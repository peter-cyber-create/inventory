import React, { useEffect, useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import requisitionImage from "../../../../assets/images/requisition.png";
import API from "../../../../helpers/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const AddRequisition = () => {
  const [loading, setLoading] = useState();
  const [vehicles, setVehicles] = useState([]);

  const history = useHistory();
  const [formData, setFormData] = useState({
    vehicleId: null,
    department: "",
    serviceOfficer: "",
    // telephone: "",
    driverName: "",
    mobile: "",
    registrationNo: "",
    // date: "",
    currentMileage: "",
    lastServiceMileage: "",
    projectUnit: "",
    emailAddress: "",
    reqDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      vehicleId: Number(formData.vehicleId),
    };
    try {
      const response = await API.post('/api/v/service/request', formData);
      setLoading(false);
      history.push("/fleet/requistion");
      toast.success('Service Requistion Has Been Added Successfully');
    } catch (error) {}
    console.log("Form submitted:", data);
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
  useEffect(() => {
    loadVehicle();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card bg-light border rounded shadow">
            <div className="card-body">
              {/* Header Image */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-sm-flex">
                    <div style={{ width: "100%", overflow: "hidden" }}>
                      <img
                        src={requisitionImage || "/placeholder.svg"}
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
                {/* Department Information Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Department Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="projectUnit">
                          <Form.Label className="text-uppercase small fw-bold">
                            PROJECT/UNIT
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="projectUnit"
                            value={formData.projectUnit}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group controlId="department">
                          <Form.Label className="text-uppercase small fw-bold">
                            HEAD OF DEPARTMENT:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="signature">
                          <Form.Label className="text-uppercase small fw-bold">
                            SIGNATURE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group controlId="serviceOfficer">
                          <Form.Label className="text-uppercase small fw-bold">
                            SERVICE REQ. OFFICER:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="serviceOfficer"
                            value={formData.serviceOfficer}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="telephone">
                          <Form.Label className="text-uppercase small fw-bold">
                            SIGNATURE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="tel"
                            name="telephone"
                            // value={formData.telephone}
                            // onChange={handleInputChange}
                            required
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Contact Information Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Contact Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group controlId="driverName">
                          <Form.Label className="text-uppercase small fw-bold">
                            DRIVER NAME:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="mobile">
                          <Form.Label className="text-uppercase small fw-bold">
                            MOBILE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="emailAddress">
                          <Form.Label className="text-uppercase small fw-bold">
                            EMAIL ADDRESS:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="email"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Vehicle Information Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Vehicle Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="oldRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">
                            Old REG NO:
                          </Form.Label>
                          <Form.Select
                            className="bg-transparent"
                            name="vehicleId"
                            data-select-type="old"
                            value={formData.vehicleId || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select Old REG NO
                            </option>
                            {vehicles?.map((option, index) => (
                              <option key={index} value={option.id}>
                                {option.old_number_plate}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="newRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">
                            New REG NO:
                          </Form.Label>
                          <Form.Select
                            className="bg-transparent"
                            name="vehicleId"
                            data-select-type="new"
                            value={formData.vehicleId || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select New REG NO
                            </option>
                            {vehicles?.map((option, index) => (
                              <option key={index} value={option.id}>
                                {option.new_number_plate}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="date">
                          <Form.Label className="text-uppercase small fw-bold">
                            DATE:
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
                      <Col md={6}>
                        <Form.Group controlId="reqDate">
                          <Form.Label className="text-uppercase small fw-bold">
                            REQ DATE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="date"
                            name="reqDate"
                            value={formData.reqDate}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="currentMileage">
                          <Form.Label className="text-uppercase small fw-bold">
                            CURRENT MILEAGE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="number"
                            name="currentMileage"
                            value={formData.currentMileage}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="lastServiceMileage">
                          <Form.Label className="text-uppercase small fw-bold">
                            LAST SERVICE MILEAGE:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="number"
                            name="lastServiceMileage"
                            value={formData.lastServiceMileage}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Authorization Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Authorization
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col>
                        <Form.Group controlId="transportOfficer">
                          <Form.Label className="small fw-bold">
                            1. TRANSPORT OFFICER:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Group controlId="mechanicalEngineer">
                          <Form.Label className="small fw-bold">
                            2. AUTOMOTIVE/MECHANICAL ENGINEER:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="inchargeServiceBay">
                          <Form.Label className="small fw-bold">
                            3. INCHARGE SERVICE BAY:
                          </Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button variant="primary" type="submit" size="lg">
                    Submit Requisition
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

export default AddRequisition;

// import React, { useState } from "react";
// import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
// import requisitionImage from "../../../../assets/images/requisition.png";

// const AddRequisition = () => {
//   const [formData, setFormData] = useState({
//     department: "",
//     serviceOfficer: "",
//     telephone: "",
//     driverName: "",
//     mobile: "",
//     registrationNo: "",
//     date: "",
//     currentMileage: "",
//     lastServiceMileage: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row justify-content-center">
//         <div className="col-10">
//           <div className="card bg-light border rounded shadow">
//             <div className="card-body">
//               <div className="row mb-3">
//                 <div className="col-12">
//                   <div className="d-sm-flex mb-3">
//                     <div
//                       style={{
//                         width: "100%",
//                         // height: "20vh",
//                         overflow: "hidden",
//                       }}
//                     >
//                       <img
//                         src={requisitionImage}
//                         alt=""
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "contain",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <Form onSubmit={handleSubmit}>
//                 <Row className="mb-3">
//                   <Col md={12} className="mb-3">
//                     <Form.Group controlId="department">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         PROJECT/UNIT
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="department"
//                         // value={formData.department}
//                         // onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={8}>
//                     <Form.Group controlId="department">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         HEAD OF DEPARTMENT:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="department"
//                         value={formData.department}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group controlId="signature">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         SIGNATURE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         disabled
//                         // placeholder="For physical signature"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row className="mb-3">
//                   <Col md={8}>
//                     <Form.Group controlId="serviceOfficer">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         SERVICE REQ. OFFICER:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="serviceOfficer"
//                         value={formData.serviceOfficer}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group controlId="telephone">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         TELEPHONE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="tel"
//                         name="telephone"
//                         value={formData.telephone}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row className="mb-3">
//                   <Col md={8}>
//                     <Form.Group controlId="driverName">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         DRIVER NAME:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="driverName"
//                         value={formData.driverName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group controlId="mobile">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         MOBILE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="tel"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row className="mb-3">
//                   <Col md={12}>
//                     <Form.Group controlId="registrationNo">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         EMAIL ADDRESS:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="registrationNo"
//                         value={formData.registrationNo}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={12}>
//                     <Form.Group controlId="registrationNo">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         REG NO:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="text"
//                         name="registrationNo"
//                         value={formData.registrationNo}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="date">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         DATE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="date">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         REQ DATE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="date"
//                         name="date"
//                         value={formData.date}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="currentMileage">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         CURRENT MILEAGE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="number"
//                         name="currentMileage"
//                         value={formData.currentMileage}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="currentMileage">
//                       <Form.Label className="text-uppercase small fw-bold">
//                         LAST SERVICE MILEAGE:
//                       </Form.Label>
//                       <Form.Control
//                         className="bg-transparent"
//                         type="number"
//                         name="currentMileage"
//                         value={formData.lastServiceMileage}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Card className="mb-4 bg-transparent">
//                   <Card.Header className="bg-transparent">
//                     <h6 className="text-uppercase mb-0 fw-bold">AUTHORISED:</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="mb-2">
//                       <Col>
//                         <Form.Group controlId="transportOfficer">
//                           <Form.Label className="small fw-bold">
//                             1. TRANSPORT OFFICER:
//                           </Form.Label>
//                           <Form.Control
//                             className="bg-transparent"
//                             type="text"
//                             disabled
//                             // placeholder="For physical signature"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row className="mb-2">
//                       <Col>
//                         <Form.Group controlId="mechanicalEngineer">
//                           <Form.Label className="small fw-bold">
//                             2. AUTOMOTIVE/MECHANICAL ENGINEER:
//                           </Form.Label>
//                           <Form.Control
//                             className="bg-transparent"
//                             type="text"
//                             disabled
//                             // placeholder="For physical signature"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col>
//                         <Form.Group controlId="inchargeServiceBay">
//                           <Form.Label className="small fw-bold">
//                             3. INCHARGE SERVICE BAY:
//                           </Form.Label>
//                           <Form.Control
//                             className="bg-transparent"
//                             type="text"
//                             disabled
//                             // placeholder="For physical signature"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>

//                 <div className="text-center">
//                   <Button variant="primary" type="submit" size="lg">
//                     Submit Requisition
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddRequisition;

// // import React, { useState, useEffect, Fragment } from "react";
// // import { toast } from "react-toastify";
// // import Select from "react-select";
// // import API from "../../../../helpers/api";
// // import FNSpinner from "../../../../components/FNSpinner";

// // const AddRequistion = ({ close, refresh }) => {
// //   const [deptId, setDept] = useState(null);
// //   const [depts, setDepts] = useState([]);
// //   const [drivers, setDrivers] = useState([]);
// //   const [driverId, setDriverId] = useState("");

// //   const [driver, setDriver] = useState("");

// //   const [loading, setLoading] = useState(false);
// //   const [vehicles, setVehicles] = useState([]);
// //   const [vehicleId, setVehicleId] = useState();
// //   const [description, setDescription] = useState("");
// //   const [currentMileage, setCurrentMileage] = useState("");
// //   const [previousMileage, setPreviousMileage] = useState("");

// //   const handleChangeDept = (selectedOption) => {
// //     setDept(selectedOption.value);
// //   };

// //   const handleChangeVehicle = (selectedOption) => {
// //     setVehicleId(selectedOption.value);
// //   };

// //   const handleChangeDriver = (selectedOption) => {
// //     setDriverId(selectedOption.value);
// //   };

// //   const loadDepts = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await API.get(`/depts`);
// //       console.log(res);
// //       setDepts(res?.data.dept);
// //       setLoading(false);
// //     } catch (error) {
// //       console.log("error", error);
// //       setLoading(false);
// //     }
// //   };

// const loadVehicle = async () => {
//   setLoading(true);
//   try {
//     const res = await API.get(`/v/vehicle`);
//     console.log(res);
//     setVehicles(res?.data.vehicle);
//     setLoading(false);
//   } catch (error) {
//     console.log("error", error);
//     setLoading(false);
//   }
// };

// //   const loadDriver = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await API.get(`/v/driver`);
// //       console.log(res);
// //       setDrivers(res?.data.driver);
// //       setLoading(false);
// //     } catch (error) {
// //       console.log("error", error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const data = {
// //     //   deptId: null,
// //       driver,
// //       vehicleId,
// //       description,
// //       previousMileage,
// //       currentMileage,
// //       isRequest: true,
// //     };

// //     try {
// const response = await API.post('/api/v/service/request', data);
// setLoading(false);
// close();
// refresh();
// toast.success('Service Requistion Has Been Added Successfully');
// //     } catch (error) {
// //       console.log("error", error);
// //       setLoading(false);
// //       toast.error("Error while Adding Service Requistion");
// //     }
// //   };

// //   useEffect(() => {
// //     loadDepts();
// //     loadVehicle();
// //     loadDriver();
// //   }, []);

// //   return (
// //     <Fragment>
// //       <section
// //         id="kyc-verify-wizard-p-0"
// //         role="tabpanel"
// //         aria-labelledby="kyc-verify-wizard-h-0"
// //         class="body current"
// //         aria-hidden="false"
// //       >
// //         <form>
// //           <div class="row">
// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kycselectcity-input" class="form-label">
// //                   Select Old Vehicle Number Plate
// //                 </label>
// //                 <Select
// //                   defaultValue={vehicleId}
// //                   onChange={handleChangeVehicle}
// //                   options={vehicles.map((veh) => ({
// //                     value: veh.id,
// //                     label: veh.old_number_plate,
// //                   }))}
// //                   placeholder="Select Vehicle Number Plate"
// //                 />
// //               </div>
// //             </div>
// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kycselectcity-input" class="form-label">
// //                   Select New Vehicle Number Plate
// //                 </label>
// //                 <Select
// //                   defaultValue={vehicleId}
// //                   onChange={handleChangeVehicle}
// //                   options={vehicles.map((veh) => ({
// //                     value: veh.id,
// //                     label: veh.old_number_plate,
// //                   }))}
// //                   placeholder="Select Vehicle Number Plate"
// //                 />
// //               </div>
// //             </div>
// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kycselectcity-input" class="form-label">
// //                   Request Driver
// //                 </label>

// //                 <input
// //                   type="text"
// //                   class="form-control"
// //                   id="kycfirstname-input"
// //                   placeholder="Driver Name"
// //                   value={driver}
// //                   onChange={(e) => setDriver(e.target.value)}
// //                 />
// //                 {/* <Select
// //                   defaultValue={driverId}
// //                   onChange={handleChangeDriver}
// //                   options={drivers.map((driver) => ({
// //                     value: driver.id,
// //                     label: driver.names,
// //                   }))}
// //                   placeholder="Select Request Driver"
// //                 /> */}
// //               </div>
// //             </div>

// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kycfirstname-input" class="form-label">
// //                   Department
// //                 </label>
// //                 <Select
// //                   defaultValue={deptId}
// //                   onChange={handleChangeDept}
// //                   options={depts.map((d) => ({ value: d.id, label: d.name }))}
// //                   placeholder="Select Department"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div class="row">
// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kycfirstname-input" class="form-label">
// //                   Current Mileage
// //                 </label>
// //                 <input
// //                   type="text"
// //                   class="form-control"
// //                   id="kycfirstname-input"
// //                   placeholder=""
// //                   value={currentMileage}
// //                   onChange={(e) => setCurrentMileage(e.target.value)}
// //                 />
// //               </div>
// //             </div>
// //             <div class="col-lg-6">
// //               <div class="mb-3">
// //                 <label for="kyclastname-input" class="form-label">
// //                   Previous Mileage
// //                 </label>
// //                 <input
// //                   type="text"
// //                   class="form-control"
// //                   id="kyclastname-input"
// //                   placeholder=""
// //                   value={previousMileage}
// //                   onChange={(e) => setPreviousMileage(e.target.value)}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div class="row">
// //             <div class="col-lg-12">
// //               <div class="mb-3">
// //                 <label for="kycfirstname-input" class="form-label">
// //                   Service Description
// //                 </label>
// //                 <textarea
// //                   type="text"
// //                   class="form-control"
// //                   id="kycfirstname-input"
// //                   placeholder=""
// //                   rows="3"
// //                   value={description}
// //                   onChange={(e) => setDescription(e.target.value)}
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="actions clearfix">
// //             <button
// //               className=" btn btn-primary"
// //               onClick={handleSubmit}
// //               style={{ cursor: "pointer" }}
// //             >
// //               {loading ? <FNSpinner /> : "Add Service Request"}
// //             </button>
// //           </div>
// //         </form>
// //       </section>
// //     </Fragment>
// //   );
// // };

// // export default AddRequistion;
