import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import receiveImage from "../../../../assets/images/receiving.png";
import API from "../../../../helpers/api";
import VehicleTable from "../../JobCard/VehicleTable";
import { useParams } from "react-router-dom";

const ReqDetailsPage = () => {
  const [received, setReceived] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const loadGarageReceive = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/receive/${id}`);
      setReceived(res?.data.garage);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  useEffect(() => {
    loadGarageReceive();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // if (!received) {
  //   return <div>No data found</div>
  // }
  console.log("-------", received);
  const printRef = useRef(null);

  return (
    <>
      {" "}
      <Container fluid ref={printRef}>
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

                {/* Basic Information */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">
                      Basic Information
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Transport Officer:
                        </p>
                        <p>{received?.transportOfficer}</p>
                      </Col>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Date:
                        </p>
                        <p>{received?.date}</p>
                      </Col>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Time:
                        </p>
                        <p>{received?.time}</p>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Old Number Plate:
                        </p>
                        <p>{received?.oldNumberPlate}</p>
                      </Col>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          New Number Plate:
                        </p>
                        <p>{received?.newNumberPlate}</p>
                      </Col>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Mileage:
                        </p>
                        <p>{received?.mileage}</p>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={12}>
                        <VehicleTable vehicle={received?.vehicle} />
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
                      <Col >
                        <p className="mb-1">
                          Battery: {received?.battery ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Radiator: {received?.radiator ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Engine Oil: {received?.engineOil ? "✓" : "✗"}
                        </p>
                      </Col>
                      <Col >
                        <p className="mb-1">
                          Brakes: {received?.brakes ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Tires: {received?.tires ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Lights: {received?.lights ? "✓" : "✗"}
                        </p>
                      </Col>
                      <Col >
                        <p className="mb-1">
                          Steering: {received?.steering ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Clutch: {received?.clutch ? "✓" : "✗"}
                        </p>
                        <p className="mb-1">
                          Gearbox: {received?.gearbox ? "✓" : "✗"}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        <p className="mb-1">
                          Differential: {received?.differential ? "✓" : "✗"}
                        </p>
                      </Col>
                      <Col >
                        <p className="mb-1">
                          Propeller: {received?.propeller ? "✓" : "✗"}
                        </p>
                      </Col>
                      <Col >
                        <p className="mb-1">
                          Water Level: {received?.waterLevel ? "✓" : "✗"}
                        </p>
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
                    <p>{received?.remarks || "No remarks"}</p>
                  </Card.Body>
                </Card>

                {/* Signatures */}
                <Card className="mb-4 bg-transparent">
                  <Card.Header className="bg-light">
                    <h6 className="text-uppercase mb-0 fw-bold">Signatures</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Signature of User:
                        </p>
                        <p>{received?.userSignature || "Not signed"}</p>
                      </Col>
                      <Col >
                        <p className="mb-1 text-uppercase small fw-bold">
                          Accepted By:
                        </p>
                        <p>{received?.acceptedBy || "Not accepted"}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
      <div className="d-flex justify-content-end">
        <button className="btn btn-outline-warning " onClick={handlePrint}>
          Print Request
        </button>
      </div>
    </>
  );
};

export default ReqDetailsPage;
