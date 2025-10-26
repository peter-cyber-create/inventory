import React, { useEffect, useState } from "react";
import FNModal from "../../../../components/FNModal";
import AddDisposal from "./Popups/AddDisposal";
import { Card } from "react-bootstrap";
import API from "../../../../helpers/api";

const Disposal = ({ vehicle }) => {
  const [showModal, setShowModal] = useState(false);
  const [disposed, setDisposed] = useState(false);

  const getVehicle = async () => {
    // setLoading(true);
    try {
      const res = await API.get(`/v/disposal/${vehicle.id}`);
      console.log("099009009", res);
      // setLoading(false);

      if (res.data?.status === "success") {
        setDisposed(true);
      } else {
        setDisposed(false);
      }
    } catch (error) {
      // setLoading(false);
    }
  };
 

  useEffect(() => {
    if (vehicle?.id) {
      getVehicle();
    }
  }, [vehicle?.id]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  console.log("veh", disposed);
  return (
    <div class="tab-pane" id="vdisposal" role="tabpanel">
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg=""
        title="Disposal Vehicle"
      >
        <AddDisposal close={handleClose} vehicle={vehicle} />
      </FNModal>
      <div className="row">
        <div class="col-12">
          <div class="btn-toolbar">
            <div class="btn-group text-right ms-auto mb-2">
              <button class="btn btn-primary" onClick={handleShow}>
                Disposal Vehicle
              </button>
            </div>
          </div>
          {disposed ? (
            <Card className="mb-4 ">
              <Card.Header className="bg-transparent">
                <h6 className="text-uppercase mb-0 fw-bold">
                  Disposed Vehicle
                </h6>
              </Card.Header>
              <Card.Body>
                <div class="table-responsive">
                  <div class="table-responsive">
                    <table class="table table-bordered border-primary mb-0">
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Old Number Plate
                          </th>
                          <td>{vehicle?.old_number_plate}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            New Number Plate
                          </th>
                          <td>{vehicle?.new_number_plate}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Type
                          </th>
                          <td>{vehicle?.type}</td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Make
                          </th>
                          <td>{vehicle?.make}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Chassis No
                          </th>
                          <td>{vehicle?.chassis_no}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Engine No
                          </th>
                          <td>{vehicle?.engine_no}</td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            YOM
                          </th>
                          <td>{vehicle?.YOM}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Fuel
                          </th>
                          <td>{vehicle?.fuel}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Engine CC
                          </th>
                          <td>{vehicle?.power}</td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Total Cost
                          </th>
                          <td>{vehicle?.total_cost}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Country of Origin
                          </th>
                          <td>{vehicle?.country_of_origin}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            User Department
                          </th>
                          <td>{vehicle?.user_department}</td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Officer
                          </th>
                          <td>{vehicle?.officer}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Driver
                          </th>
                          <td>{vehicle?.driver}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Contact
                          </th>
                          <td>{vehicle?.contact}</td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Mileage
                          </th>
                          <td>{vehicle?.mileage}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Sticker No
                          </th>
                          <td>{vehicle?.sticker_no}</td>
                          <th
                            scope="row"
                            style={{ backgroundColor: "#f2f2f2" }}
                          >
                            Age
                          </th>
                          <td>{vehicle?.age}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-4 ">
              <Card.Body>
                <h6 className="text-uppercase text-warning mb-0 fw-bold">
                  Vehicle Not Yet Disposed
                </h6>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disposal;
