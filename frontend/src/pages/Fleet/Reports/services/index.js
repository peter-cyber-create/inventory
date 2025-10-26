import React, { useState } from "react"
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap"

const Services = () => {
  const [formData, setFormData] = useState({
    department: "",
    serviceOfficer: "",
    telephone: "",
    driverName: "",
    mobile: "",
    registrationNo: "",
    date: "",
    currentMileage: "",
    lastServiceMileage: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
            <h5 className="text-uppercase small text-secondary">
              INHOUSE GARAGE VEHICLE MAINTENANCE/SERVICE REQUISITION FORM
            </h5>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="department">
                  <Form.Label className="text-uppercase small fw-bold">HEAD OF DEPARTMENT:</Form.Label>
                  <Form.Control
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
                  <Form.Label className="text-uppercase small fw-bold">SIGNATURE:</Form.Label>
                  <Form.Control type="text" disabled placeholder="For physical signature" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="serviceOfficer">
                  <Form.Label className="text-uppercase small fw-bold">SERVICE REQ. OFFICER:</Form.Label>
                  <Form.Control
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
                  <Form.Label className="text-uppercase small fw-bold">TELEPHONE:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="driverName">
                  <Form.Label className="text-uppercase small fw-bold">DRIVER NAME:</Form.Label>
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
                <Form.Group controlId="mobile">
                  <Form.Label className="text-uppercase small fw-bold">MOBILE:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="registrationNo">
                  <Form.Label className="text-uppercase small fw-bold">REG NO:</Form.Label>
                  <Form.Control
                    type="text"
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="date">
                  <Form.Label className="text-uppercase small fw-bold">DATE:</Form.Label>
                  <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="currentMileage">
                  <Form.Label className="text-uppercase small fw-bold">CURRENT MILEAGE:</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentMileage"
                    value={formData.currentMileage}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Form.Group controlId="lastServiceMileage">
                  <Form.Label className="text-uppercase small fw-bold">LAST SERVICE MILEAGE:</Form.Label>
                  <Form.Control
                    type="number"
                    name="lastServiceMileage"
                    value={formData.lastServiceMileage}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h6 className="text-uppercase mb-0 fw-bold">AUTHORISED:</h6>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <Form.Group controlId="transportOfficer">
                      <Form.Label className="small fw-bold">1. TRANSPORT OFFICER:</Form.Label>
                      <Form.Control type="text" disabled placeholder="For physical signature" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group controlId="mechanicalEngineer">
                      <Form.Label className="small fw-bold">2. AUTOMOTIVE/MECHANICAL ENGINEER:</Form.Label>
                      <Form.Control type="text" disabled placeholder="For physical signature" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="inchargeServiceBay">
                      <Form.Label className="small fw-bold">3. INCHARGE SERVICE BAY:</Form.Label>
                      <Form.Control type="text" disabled placeholder="For physical signature" />
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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Services
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
`}</style>

