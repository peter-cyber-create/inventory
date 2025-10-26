import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import API from "../../../../helpers/api";
import { toast } from "react-toastify";
import FNModal from "../../../../components/FNModal";
import FNSpinner from "../../../../components/FNSpinner";
import FNTable from "../../../../components/FNTable";
import EnhancedTable from "../../../../components/FNTable/EnhancedTable";

const DisplayRequests = ({ service, setService, Refresh }) => {
  const [loading, setLoading] = useState([]);
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdate] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const updateClose = () => setUpdate(false);

  const history = useHistory();
  

  const handleDelete = async (id) => {
    setId(id);
    setLoading(true);
    try {
      const res = await API.delete(`/v/service/${id}`);
      // Refresh();
      setLoading(false);
      toast.success(`Service Requistion Has Been Deleted Successfully`);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error Encountered while Delete Service Requistion Request");
    }
  };

  const columns = [
    { key: "id", label: "ID" },

    {
      key: "vehicle.old_number_plate",
      label: "Number Plate",
      render: (value, rowData) => (
        <p>
          {rowData.vehicle.old_number_plate || rowData.vehicle.new_number_plate}
        </p>
      ),
    },
    {
      key: "createdAt",
      label: "Req Created At",
      render: (value, rowData) => <p>{rowData.vehicle.createdAt}</p>,
    },
    {
      key: "driverName",
      label: "Driver Name",
      render: (value, rowData) => <p>{rowData.driverName}</p>,
    },
    {
      key: "currentMileage",
      label: "Current Mileage",
      render: (value, rowData) => <p>{rowData.currentMileage}</p>,
    },
    {
      key: "lastServiceMileage",
      label: "Last Service Mileage",
      render: (value, rowData) => <p>{rowData.lastServiceMileage}</p>,
    },

    {
      key: "actions",
      label: "Actions",
      render: (value, rowData) => (
        <div className="d-flex align-items-center gap-2">
          {/* Edit Icon */}

          <Link to={`/fleet/requistion/edit/${rowData.id}`}>
            <i class="mdi mdi-comment-edit-outline font-size-20 link-warning"></i>
          </Link>

          {/* View Details Icon */}
          <Link to={`/fleet/requistion/${rowData.id}`}>
            <i class="mdi mdi-eye font-size-20"></i>
          </Link>

          {/* Delete Icon */}

          <a
            href="#"
            className=""
            onClick={() => handleDelete(rowData.id)}
            // onClick={() => {
            //   setCurrentId(rowData.id);
            //   setShowModal(true);
            // }}
          >
            <i class="mdi mdi-trash-can font-size-20 link-danger"></i>
          </a>
        </div>
      ),
    },
  ];
  console.log("sevice====", service);

  return (
    <Fragment>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Service Requistions Listing</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <Link to="/ict/service">Vehicles</Link>
                </li>
                <li class="breadcrumb-item active">Requistions</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <FNSpinner />
      ) : (
        <>
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="row mb-2">
                        <div class="col-sm-4">
                          {/* <div class="search-box me-2 mb-2 d-inline-block">
                            <div class="position-relative">
                              <input
                                type="text"
                                class="form-control"
                                id="searchTableList"
                                placeholder="Search..."
                              />
                              <i class="bx bx-search-alt search-icon"></i>
                            </div>
                          </div> */}
                        </div>
                        <div class="col-sm-8">
                          <div class="text-sm-end">
                            <Link to={`/fleet/requistion/add`}>
                              <button
                                type="submit"
                                class="btn btn-primary waves-effect waves-light"
                                onClick={handleShow}
                              >
                                Add New Service Request
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <EnhancedTable data={service} columns={columns} />
                      {/* <FNTable
                        columns={tableColumns}
                        data={service}
                        onViewDetails={handleView}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default DisplayRequests;
