import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import requisitionImage from "../../../../assets/images/requisition.png";
import API from "../../../../helpers/api";
import { useParams } from "react-router-dom";

const Section = ({ title, children }) => (
  <Card className="border-0 mb-4">
    <Card.Header className="bg-light border-0">
      <h6 className="text-uppercase fw-bold mb-0">{title}</h6>
    </Card.Header>
    <Card.Body>{children}</Card.Body>
  </Card>
);

const RequisitionDetails = () => {
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const printRef = useRef(null);

  useEffect(() => {
    const loadRequisition = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/v/service/${id}`);
        setRequisition(res?.data.service);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequisition();
  }, [id]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!requisition)
    return <div className="text-center py-5">No requisition found</div>;

  return (
    <>
      {" "}
      <Container fluid className="py-4" ref={printRef}>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="border-0 shadow-sm rounded-3 p-4 bg-white">
              {/* Print Button */}
              {/* <div className="d-flex justify-content-end mb-3 d-print-none">
                <Button variant="primary" onClick={handlePrint}>
                  Print Requisition
                </Button>
              </div> */}

              {/* Image */}
              <Row className="mb-4">
                <Col xs={12} className="text-center">
                  <img
                    src={requisitionImage || "/placeholder.svg"}
                    alt="Requisition"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </Col>
              </Row>

              {/* Reusable Section Component */}

              {/* Department Information */}
              <Section title="Department Information">
                <Row className="g-4">
                  <Col>
                    <Info
                      label="Project/Unit"
                      value={requisition.projectUnit}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Head of Department"
                      value={requisition.department}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Service Req. Officer"
                      value={requisition.serviceOfficer}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Signature"
                      value={requisition.departmentSignature || "Not signed"}
                    />
                  </Col>
                </Row>
              </Section>

              {/* Contact Information */}
              <Section title="Contact Information">
                <Row className="g-4">
                  <Col>
                    <Info label="Driver Name" value={requisition.driverName} />
                  </Col>
                  <Col>
                    <Info label="Mobile" value={requisition.mobile} />
                  </Col>
                  <Col>
                    <Info
                      label="Email Address"
                      value={requisition.emailAddress}
                    />
                  </Col>
                </Row>
              </Section>

              {/* Vehicle Information */}
              <Section title="Vehicle Information">
                <Row className="g-4">
                  <Col>
                    <Info
                      label="Old Reg No"
                      value={requisition.oldRegistrationNo}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="New Reg No"
                      value={requisition.newRegistrationNo}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Current Mileage"
                      value={requisition.currentMileage}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Last Service Mileage"
                      value={requisition.lastServiceMileage}
                    />
                  </Col>
                </Row>
              </Section>

              {/* Authorization */}
              <Section title="Authorization">
                <Row className="g-4">
                  <Col>
                    <Info
                      label="Transport Officer"
                      value={requisition.transportOfficer || "Not signed"}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Mechanical Engineer"
                      value={requisition.mechanicalEngineer || "Not signed"}
                    />
                  </Col>
                  <Col>
                    <Info
                      label="Incharge Service Bay"
                      value={requisition.inchargeServiceBay || "Not signed"}
                    />
                  </Col>
                </Row>
              </Section>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container>
        {" "}
        <Row className="">
          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-warning " onClick={handlePrint}>
              Print Request
            </button>
          </div>
        </Row>
      </Container>
    </>
  );
};

/* Info Component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-uppercase small fw-bold text-secondary mb-1">{label}</p>
    <p className="mb-0">{value || "N/A"}</p>
  </div>
);

export default RequisitionDetails;
