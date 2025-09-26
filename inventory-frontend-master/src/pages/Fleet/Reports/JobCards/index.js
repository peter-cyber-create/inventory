import React, { useState } from "react"
import { Form, Card, Container, Row, Col, Button } from "react-bootstrap"

const JobCards = () => {
  const [formData, setFormData] = useState({
    transportOfficer: "",
    date: "",
    time: "",
    vehicleReg: "",
    driverName: "",
    mileage: "",
    batteryCheck: false,
    radiatorCheck: false,
    engineOilCheck: false,
    brakesCheck: false,
    tiresCheck: false,
    lightsCheck: false,
    remarks: "",
    userSignature: "",
    acceptedBy: "",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <div className="text-center mb-4">
            <h4 className="text-primary mb-1">MINISTRY OF HEALTH</h4>
            <h5 className="text-uppercase small text-secondary">INHOUSE GARAGE SERVICING FORM</h5>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="transportOfficer">
                  <Form.Label className="text-uppercase small fw-bold">Transport Officer:</Form.Label>
                  <Form.Control
                    type="text"
                    name="transportOfficer"
                    value={formData.transportOfficer}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="date">
                  <Form.Label className="text-uppercase small fw-bold">Date:</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="time">
                  <Form.Label className="text-uppercase small fw-bold">Time:</Form.Label>
                  <Form.Control type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group controlId="vehicleReg">
                  <Form.Label className="text-uppercase small fw-bold">Vehicle Reg:</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleReg"
                    value={formData.vehicleReg}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="driverName">
                  <Form.Label className="text-uppercase small fw-bold">Driver Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="mileage">
                  <Form.Label className="text-uppercase small fw-bold">Mileage:</Form.Label>
                  <Form.Control
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h6 className="text-uppercase mb-0 fw-bold">Vehicle Checks</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="batteryCheck"
                        label="Battery"
                        name="batteryCheck"
                        checked={formData.batteryCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="radiatorCheck"
                        label="Radiator"
                        name="radiatorCheck"
                        checked={formData.radiatorCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="engineOilCheck"
                        label="Engine Oil"
                        name="engineOilCheck"
                        checked={formData.engineOilCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="brakesCheck"
                        label="Brakes"
                        name="brakesCheck"
                        checked={formData.brakesCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="tiresCheck"
                        label="Tires"
                        name="tiresCheck"
                        checked={formData.tiresCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="lightsCheck"
                        label="Lights"
                        name="lightsCheck"
                        checked={formData.lightsCheck}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Form.Group className="mb-4">
              <Form.Label className="text-uppercase small fw-bold">Remarks:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="userSignature">
                  <Form.Label className="text-uppercase small fw-bold">Signature of User:</Form.Label>
                  <Form.Control
                    type="text"
                    name="userSignature"
                    value={formData.userSignature}
                    onChange={handleInputChange}
                    disabled
                    placeholder="For physical signature"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="acceptedBy">
                  <Form.Label className="text-uppercase small fw-bold">Accepted By:</Form.Label>
                  <Form.Control
                    type="text"
                    name="acceptedBy"
                    value={formData.acceptedBy}
                    onChange={handleInputChange}
                    disabled
                    placeholder="For physical signature"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit" size="lg">
                Submit Form
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default JobCards
;<style jsx>{`
  .form-label {
    margin-bottom: 0.25rem;
  }
  .form-control {
    border-radius: 0;
  }
  .card {
    border-radius: 0;
  }
  .btn-primary {
    border-radius: 0;
  }
  .form-check-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    font-weight: 600;
  }
`}</style>

