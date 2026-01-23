import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../../helpers/api";

function AddReceivedSpare({ sparePart, close, refresh }) {
  const [receivedSpareQty, setReceivedSpareQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prevSpareQty = Number(sparePart.qty);
  const finalSpareQty = prevSpareQty + Number(receivedSpareQty || 0);

  useEffect(() => {
    if (sparePart) {
      setReceivedSpareQty("");
    }
  }, [sparePart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !receivedSpareQty ||
      isNaN(receivedSpareQty) ||
      Number(receivedSpareQty) <= 0
    ) {
      setError("Please enter a valid quantity");
      setLoading(false);
      return;
    }

    const data = {
      prevSpareQty,
      finalSpareQty,
      receivedSpareQty: Number(receivedSpareQty),
      spareId: sparePart.id,
    };

    try {
      await API.post('/api/v/sparepartQty', data);
      setLoading(false);

      refresh();
      close();
      toast.success('Spare Part Qty Has Been Added Successfully');
    } catch (error) {
      console.error("Error adding spare part:", error);
      setLoading(false);
      setError("Error encountered while adding spare part. Please try again.");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">{sparePart?.partname}</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="receivedSpareQty">
                <Form.Label className="text-uppercase small fw-bold">
                  Received Spare Quantity:
                </Form.Label>
                <Form.Control
                  type="number"
                  value={receivedSpareQty}
                  onChange={(e) => setReceivedSpareQty(e.target.value)}
                  placeholder="Enter the quantity of received spare"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="currentSpareQty">
                <Form.Label className="text-uppercase small fw-bold">
                  Current Spare Quantity:
                </Form.Label>
                <Form.Control type="number" value={prevSpareQty} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="totalSpareQty">
                <Form.Label className="text-uppercase small fw-bold">
                  Total Spare Quantity:
                </Form.Label>
                <Form.Control type="number" value={finalSpareQty} disabled />
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={close} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Spare"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddReceivedSpare;
