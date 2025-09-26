import React, { useEffect, useState } from "react"
import { Form, Card, Container, Row, Col, Button } from "react-bootstrap"
import receiveImage from "../../../../assets/images/receiving.png"
import API from "../../../../helpers/api"
import VehicleTable from "../../JobCard/VehicleTable"
import Select from "react-select"
import { toast } from "react-toastify"
import { useHistory, useParams } from "react-router-dom"

const EditGarageServicingForm = () => {
  const [vehicles, setVehicles] = useState([])
  const [vehicle, setVehicle] = useState()
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const { id } = useParams() // Get the ID from the URL

  const [formData, setFormData] = useState({
    vehicleId: null,
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
  })




  const loadData = async () => {
    try {
      const [vehiclesRes, formDataRes] = await Promise.all([API.get("/v/vehicle"), API.get(`/v/receive/${id}`)])
      setVehicles(vehiclesRes.data.vehicle)
      setFormData(formDataRes.data.garage)
      fetchVehicleDetails(formDataRes.data.garage.vehicleId)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error loading form data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
 

    loadData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await API.patch(`/v/receive/${id}`, formData)
      toast.success("Garage Servicing Form Updated Successfully")
      history.push("/fleet/receiving")
    } catch (error) {
      console.error("Error updating form:", error)
      toast.error("Error updating Garage Servicing Form")
    } finally {
      setLoading(false)
    }
  }

  const handleChangeVehicle = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      vehicleId: selectedOption.value,
    }))
    fetchVehicleDetails(selectedOption.value)
  }

  const fetchVehicleDetails = async (id) => {
    try {
      const res = await API.get(`/v/vehicle/${id}`)
      setVehicle(res.data.vehicle)
    } catch (error) {
      console.error("Error fetching vehicle details", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={10}>
          <Card className="bg-light border rounded shadow">
            <Card.Body>
              <Row>
                <Col xs={12}>
                  <div className="d-sm-flex mb-3">
                    <div style={{ width: "100%", overflow: "hidden" }}>
                      <img
                        src={receiveImage || "/placeholder.svg"}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Basic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group controlId="transportOfficer">
                          <Form.Label className="text-uppercase small fw-bold">Transport Officer:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="transportOfficer"
                            value={formData?.transportOfficer}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="date">
                          <Form.Label className="text-uppercase small fw-bold">Date:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="date"
                            name="date"
                            value={formData?.date}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="time">
                          <Form.Label className="text-uppercase small fw-bold">Time:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="time"
                            name="time"
                            value={formData?.time}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group controlId="oldRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">Old Number Plates</Form.Label>
                          <Select
                            className="bg-transparent bg-white"
                            value={vehicles.find((v) => v.id === formData?.vehicleId)}
                            onChange={handleChangeVehicle}
                            options={vehicles.map((vehicle) => ({
                              value: vehicle.id,
                              label: vehicle.old_number_plate,
                            }))}
                            placeholder="Select Vehicle Number Plate"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="newRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">New Number Plates</Form.Label>
                          <Select
                            className="bg-transparent bg-white"
                            value={vehicles.find((v) => v.id === formData?.vehicleId)}
                            onChange={handleChangeVehicle}
                            options={vehicles.map((vehicle) => ({
                              value: vehicle.id,
                              label: vehicle.new_number_plate,
                            }))}
                            placeholder="Select Vehicle Number Plate"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="mileage">
                          <Form.Label className="text-uppercase small fw-bold">Mileage:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="number"
                            name="mileage"
                            value={formData?.mileage}
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
                    <h6 className="text-uppercase mb-0 fw-bold">Vehicle Systems Check</h6>
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
                            checked={formData?.battery}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="radiator"
                            label="Radiator"
                            name="radiator"
                            checked={formData?.radiator}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="engineOil"
                            label="Engine Oil"
                            name="engineOil"
                            checked={formData?.engineOil}
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
                            checked={formData?.brakes}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="tires"
                            label="Tires"
                            name="tires"
                            checked={formData?.tires}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="lights"
                            label="Lights"
                            name="lights"
                            checked={formData?.lights}
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
                            checked={formData?.steering}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="clutch"
                            label="Clutch"
                            name="clutch"
                            checked={formData?.clutch}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="gearbox"
                            label="Gearbox"
                            name="gearbox"
                            checked={formData?.gearbox}
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
                            checked={formData?.differential}
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
                            checked={formData?.propeller}
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
                            checked={formData?.waterLevel}
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
                        value={formData?.remarks}
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
                          <Form.Label className="text-uppercase small fw-bold">Signature of User:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="userSignature"
                            value={formData?.userSignature}
                            onChange={handleInputChange}
                            placeholder="For physical signature"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="acceptedBy">
                          <Form.Label className="text-uppercase small fw-bold">Accepted By:</Form.Label>
                          <Form.Control
                            className="bg-transparent"
                            type="text"
                            name="acceptedBy"
                            value={formData?.acceptedBy}
                            onChange={handleInputChange}
                            placeholder="For physical signature"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button variant="primary" type="submit" size="lg">
                    Update Form
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default EditGarageServicingForm

