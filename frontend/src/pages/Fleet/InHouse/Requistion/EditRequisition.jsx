import React, { useEffect, useState } from "react"
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap"
import requisitionImage from "../../../../assets/images/requisition.png"
import API from "../../../../helpers/api"
import { useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"

const EditRequisition = () => {
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const history = useHistory()
  const { id } = useParams() // Get the requisition ID from the URL

  const [formData, setFormData] = useState({
    vehicleId: null,
    department: "",
    serviceOfficer: "",
    driverName: "",
    mobile: "",
    registrationNo: "",
    currentMileage: "",
    lastServiceMileage: "",
    projectUnit: "",
    emailAddress: "",
    reqDate: "",
    date: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, requisitionRes] = await Promise.all([
          API.get("/v/vehicle"),
          API.get(`/v/service/${id}`),
        ])
        setVehicles(vehiclesRes.data.vehicle)
        setFormData(requisitionRes.data.service)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error loading requisition data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.patch(`/v/service/${id}`, formData)
      history.push("/fleet/requistion")
      toast.success("Requisition updated successfully")
    } catch (error) {
      console.error("Error updating requisition:", error)
      toast.error("Error updating requisition")
    } finally {
      setLoading(false)
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
              {/* Header Image */}
              <Row className="mb-4">
                <Col xs={12}>
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
                </Col>
              </Row>

              <Form onSubmit={handleSubmit}>
                {/* Department Information Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Department Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="projectUnit">
                          <Form.Label className="text-uppercase small fw-bold">PROJECT/UNIT</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">HEAD OF DEPARTMENT:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">SIGNATURE:</Form.Label>
                          <Form.Control className="bg-transparent" type="text" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group controlId="serviceOfficer">
                          <Form.Label className="text-uppercase small fw-bold">SERVICE REQ. OFFICER:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">SIGNATURE:</Form.Label>
                          <Form.Control className="bg-transparent" type="tel" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Contact Information Section */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Contact Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group controlId="driverName">
                          <Form.Label className="text-uppercase small fw-bold">DRIVER NAME:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">MOBILE:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">EMAIL ADDRESS:</Form.Label>
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
                    <h6 className="text-uppercase mb-0 fw-bold">Vehicle Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="oldRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">Old REG NO:</Form.Label>
                          <Form.Select
                            className="bg-transparent"
                            name="vehicleId"
                            value={formData.vehicleId || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select Old REG NO
                            </option>
                            {vehicles?.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.old_number_plate}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="newRegistrationNo">
                          <Form.Label className="text-uppercase small fw-bold">New REG NO:</Form.Label>
                          <Form.Select
                            className="bg-transparent"
                            name="vehicleId"
                            value={formData.vehicleId || ""}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select New REG NO
                            </option>
                            {vehicles?.map((option) => (
                              <option key={option.id} value={option.id}>
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
                          <Form.Label className="text-uppercase small fw-bold">DATE:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">REQ DATE:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">CURRENT MILEAGE:</Form.Label>
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
                          <Form.Label className="text-uppercase small fw-bold">LAST SERVICE MILEAGE:</Form.Label>
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
                    <h6 className="text-uppercase mb-0 fw-bold">Authorization</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col>
                        <Form.Group controlId="transportOfficer">
                          <Form.Label className="small fw-bold">1. TRANSPORT OFFICER:</Form.Label>
                          <Form.Control className="bg-transparent" type="text" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Group controlId="mechanicalEngineer">
                          <Form.Label className="small fw-bold">2. AUTOMOTIVE/MECHANICAL ENGINEER:</Form.Label>
                          <Form.Control className="bg-transparent" type="text" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group controlId="inchargeServiceBay">
                          <Form.Label className="small fw-bold">3. INCHARGE SERVICE BAY:</Form.Label>
                          <Form.Control className="bg-transparent" type="text" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button variant="primary" type="submit" size="lg">
                    Update Requisition
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

export default EditRequisition

