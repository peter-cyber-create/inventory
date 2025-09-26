/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import FNModal from "../../../components/FNModal";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";

const Vehicles = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 20;
  const history = useHistory();

  const handleEdit = (id) => {
    setId(id);
    setShowEdit(true);
  };

  const closeEdit = () => setShowEdit(false);

  const handleDelete = (id) => {
    setId(id);
  };

  useEffect(() => {
    loadVehicles();
  }, [currentPage]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/vehicle`, {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
        },
      });
      setVehicles(res.data.vehicle || []);
      setTotalPages(res?.data.totalPages || 1);
      setTotalRecords(res?.data.totalRecords || 0);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadVehicles();
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
    loadVehicles();
  };

  const handleDownload = () => {
    if (vehicles.length === 0) {
      alert("No data to download!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(vehicles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "vehicles.xlsx");
  };

  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        lg="xl"
        title="Add New Vehicle Details"
      >
        <AddVehicle close={() => setShowModal(false)} refresh={loadVehicles} />
      </FNModal>
      <FNModal
        showModal={showEdit}
        handleClose={() => setShowEdit(false)}
        lg="xl"
        title="Edit Vehicle Details"
      >
        <EditVehicle
          close={() => setShowEdit(false)}
          refresh={loadVehicles}
          id={id}
        />
      </FNModal>
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-sm-flex align-items-center justify-content-between">
            <h2>Ministry of Health Vehicle Asset Register</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Old or New Number Plate, Make, Type, Chassis No, User Dept..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="mdi mdi-filter-outline align-middle"></i>{" "}
                    Search
                  </button>
                  <button
                    onClick={handleClear}
                    className="btn btn-light btn-sm mx-2"
                  >
                    <i className="mdi mdi-refresh"></i> Clear
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn btn-warning btn-sm mx-2"
                  >
                    <i className="bx bx-download font-size-20"></i> Download
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowModal(true)}
                  >
                    Add New Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <FNSpinner />
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table align-middle table-striped table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Old Number Plate</th>
                    <th>New Number Plate</th>
                    <th>Make</th>
                    <th>Type</th>
                    <th>YOM</th>
                    <th>User Dept</th>
                    <th>Officer</th>
                    <th>Driver</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length > 0 ? (
                    vehicles.map((v, index) => (
                      <tr key={index}>
                        <td>{v.old_number_plate}</td>
                        <td>{v.new_number_plate}</td>
                        <td>{v.make}</td>
                        <td>{v.type}</td>
                        <td>{v.YOM}</td>
                        <td>{v.user_department}</td>
                        <td>{v.officer}</td>
                        <td>{v.driver}</td>
                        <td>
                          <a
                            onClick={() =>
                              history.push(`/fleet/vehicle/${v.id}`)
                            }
                            className="action-icon text-primary mx-2"
                            style={{ cursor: "pointer" }}
                          >
                            <i className="mdi mdi-eye font-size-20"></i>
                          </a>
                          <a
                            onClick={() => handleEdit(v.id)}
                            class="action-icon text-warning mx-2"
                            style={{ cursor: "pointer" }}
                          >
                            <i class="mdi mdi-comment-edit-outline font-size-20"></i>
                          </a>
                          <a
                            onClick={() => handleDelete(v.id)}
                            className="action-icon text-danger"
                            style={{ cursor: "pointer" }}
                          >
                            <i className="mdi mdi-trash-can font-size-20"></i>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-sm-12 text-end">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalRecords)} of {totalRecords}{" "}
                Records
                <button
                  className="btn btn-primary mx-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-primary mx-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Vehicles;
