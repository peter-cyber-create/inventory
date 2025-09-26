import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
import FNModal from "../../../components/FNModal";
import API from "../../../helpers/api";
import FNSpinner from "../../../components/FNSpinner";
import FNTable from "../../../components/FNTable";
import AddSpareParts from "./AddSpareParts";
import EditSpareParts from "./EditSpareParts";
import EnhancedTable from "../../../components/FNTable/EnhancedTable";
import * as XLSX from "xlsx";

import { saveAs } from "file-saver";
import {
  CirclePlus,
  Download,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Dropdown } from "react-bootstrap";
import AddReceivedSpare from "./AddReceivedSpare";

const SpareParts = () => {
  const [loading, setLoading] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [sparePart, setSparePart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReceived, setshowReceived] = useState(false);
  const [id, setId] = useState("");
  const [makes, setMakes] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEdit = (id) => {
    setId(id);
    setShowEdit(true);
  };

  const closeEdit = () => setShowEdit(false);

  const handleDelete = async (ID) => {
    try {
      const res = await API.delete(`/v/sparepart/${ID}`);
      loadSpareParts();
    } catch (error) {
      console.log(error);
    }
  };

  const history = useHistory();

  const handleView = (id) => {
    history.push(`/fleet/vehicle/${id}`);
  };

  const loadSpareParts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/sparepart`);

      const spares = res.data.sparepart.map((veh) => ({
        ...veh,
        createdAt: moment(veh.createdAt).format("YYYY-MM-DD"),
        // id: job.id.substring(0, 8)
        // status: <span class="badge bg-warning">{ticket.status}</span>
      }));

      setSpareParts(spares);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const loadSparePart = async (ID) => {
    try {
      const res = await API.get(`/v/sparepart/${ID}`);
      const sparePartData = res.data.sparepart;
      console.log("res/////", res);
      setSparePart(sparePartData);
      setshowReceived(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    loadSpareParts();
  }, []);

  const tableColumns = [
    { key: "partno", label: "Spare Part No" },
    { key: "partname", label: "Part Name" },
    { key: "brand", label: "Part Brand" },
    { key: "vsparecategory.name", label: "Part Category" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "qty", label: "Stock Available" },
    { key: "measure", label: "Unit of Measure" },
    // { key: 'createdAt', label: 'Purchase Date' },
  ];

  const columns = [
    { key: "partno", label: "Spare Part No" },
    { key: "partname", label: "Part Name" },
    { key: "brand", label: "Part Brand" },
    { key: "vsparecategory.name", label: "Part Category" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "qty", label: "Stock Available" },
    { key: "measure", label: "Unit of Measure" },

    {
      key: "actions",
      label: "Actions",
      render: (value, rowData) => (
        <div className="d-flex align-items-center justify-content-center">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className=" border-0 rounded-circle btn btn-sm p-1 bg-warning bg-opacity-25"
            >
              <EllipsisVertical size={20} className="text-warning" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#/action-1"
                onClick={() => setShowEdit(true)}
                className="d-flex gap-2 small link-warning align-items-center "
              >
                <Pencil size={12} />
                Edit
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">
                <a
                  onClick={() => handleDelete(rowData.id)}
                  className="d-flex gap-2 small link-danger align-items-center "
                  href="#"
                >
                  {" "}
                  <Trash2 size={12} />
                  Delete
                </a>
              </Dropdown.Item>

              <Dropdown.Item href="#/action-2">
                <a
                  onClick={() => {
                    loadSparePart(rowData.id);
                  }}
                  className="d-flex gap-2 small link-success align-items-center "
                  href="#"
                >
                  {" "}
                  <CirclePlus size={12} />
                  Add Received Spare
                </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleDownload = () => {
    if (spareParts.length === 0) {
      alert("No data to download!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(spareParts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "spareParts");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "spareParts.xlsx");
  };

  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg="lg"
        title="Add New Spare Part"
      >
        <AddSpareParts close={handleClose} refresh={loadSpareParts} />
      </FNModal>
      <FNModal
        showModal={showEdit}
        handleClose={closeEdit}
        lg="lg"
        title="Edit Spare Part Details"
      >
        <EditSpareParts close={closeEdit} refresh={loadSpareParts} id={id} />
      </FNModal>

      <FNModal
        showModal={showReceived}
        handleClose={() => setshowReceived(false)}
        lg="md"
        title="Add Received Spare"
      >
        <AddReceivedSpare sparePart={sparePart} setSparePart={setSparePart} close={() => setshowReceived(false)} refresh={loadSpareParts}  />
      </FNModal>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">
              Ministry of Health Garage Spare Parts Inventory
            </h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <Link to="/ict/assets">MOH SpareParts</Link>
                </li>
                <li class="breadcrumb-item active">Listing</li>
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
                        <div class="col-sm-8  d-flex align-items-center justify-content-end">
                          <div class="text-sm-end d-flex align-items-center justify-content-end gap-2">
                            <button
                              type="submit"
                              class="btn btn-warning btn-sm waves-effect waves-light d-flex align-items-center gap-2"
                              onClick={handleDownload}
                            >
                              <Download /> Download
                            </button>

                            <button
                              type="submit"
                              class="btn btn-primary btn-sm d-flex align-items-center gap-2 waves-effect waves-light"
                              onClick={handleShow}
                            >
                              <CirclePlus /> Add New Spare Part
                            </button>
                          </div>
                        </div>
                      </div>
                      <EnhancedTable columns={columns} data={spareParts} />
                      {/* <FNTable
                        columns={tableColumns}
                        data={spareParts}
                        handleEdit={handleEdit}
                        onViewDetails={handleView}
                        handleDelete={handleDelete}
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

export default SpareParts;
