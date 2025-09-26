import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const FNTable = ({ data, handleDelete, handleEdit, handleView }) => {
  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table align-middle table-striped table-sm">
          <thead className="table-light">
            <tr>
              <th>Number Plate</th>
              <th>Received By</th>
              <th>Contact Name</th>
              <th>Funding</th>
              <th>Dept</th>
              <th>Phone No</th>
              <th>Instruction</th>
              <th className="align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((l, index) => (
              <tr key={index}>
                <td>{l.vehicle.old_number_plate||l.vehicle.new_number_plate}</td>
                <td>{l.receivedBy}</td>
                <td>{l.contactName}</td>
                <td>{l.funding}</td>
                <td>{l.dept}</td>
                <td>{l.phoneNo}</td>
                <td>{l.instruction}</td>
                <td>
                  <Link
                    // onClick={() => handleView(l.vehicleId)}
                    to={`/fleet/receiving/more/${l.id}`}
                    className="action-icon text-primary mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="mdi mdi-eye font-size-20"></i>
                  </Link>
                  {/* <Link
                    to={`/fleet/receiving/edit/${l.id}`}
                    // href={l.docLink}
                    className="action-icon text-primary mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bx bx-download font-size-20"></i>
                  </Link> */}
                  <Link
                    to={`/fleet/receiving/edit/${l.id}`}
                    // onClick={() => handleEdit(l.id)}
                    class="action-icon text-warning mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i class="mdi mdi-comment-edit-outline font-size-20"></i>
                  </Link>
                  <a
                    onClick={() => handleDelete(l.id)}
                    className="action-icon text-danger"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="mdi mdi-trash-can font-size-20"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default FNTable;
