import React, { useState, useEffect, Fragment } from "react";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import API from "../../../helpers/api";
import FNModal from "../../../components/FNModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FNSpinner from "../../../components/FNSpinner";
import EnhancedTable from "../../../components/FNTable/EnhancedTable";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { CirclePlus, Download } from "lucide-react";
import { toast } from "react-toastify";

const JobCardPage = () => {
  const [jobcards, setJobCards] = useState([]);
  const [loading, setLoading] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(-1);

  const history = useHistory();

  const loadJobCards = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/jobcards`);

      // const formattedJobs = res.data.job.map((job) => ({
      //   ...job,
      //   createdAt: moment(job.createdAt).format("YYYY-MM-DD"),
      //   //jobCard: job.id.substring(0, 8),
      //   // status: <span class="badge bg-warning">{ticket.status}</span>
      // }));
      console.log("/////////", res?.data?.results);
      setJobCards(res?.data?.results);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    setLoading(true);
    try {
      const res = await API.delete(`/jobcards/${jobId}`);
      loadJobCards();
      setShowModal(false);
      toast.success('Job Card Deleted Successful');
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDownload = () => {
    if (jobcards.length === 0) {
      alert("No data to download!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(jobcards);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "jobcards");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "jobcards.xlsx");
  };

  // const jobCardAdd = (id) => {
  //   history.push(`/fleet/jobcards/edit/${id}`);
  // };

  // const jobCardDetails = (id) => {
  //   history.push(`/fleet/jobcards/${id}`);
  // };

  // const jobCardUpdate = (id) => {
  //   history.push(`/fleet/jobcards/${id}`);
  // };

  useEffect(() => {
    loadJobCards();
  }, []);

  // const tableColumns = [
  //   { key: "vehicle.numberplate", label: "Number Plate" },
  //   { key: "driverOrCustomerName", label: "Customer Name" },
  //   { key: "dateTested", label: "Date Tested" },
  //   { key: "paymentMethod", label: "Payment method" },
  //   { key: "technicianName", label: "Technician Name" },
  // ];

  const columns = [
    { key: "id", label: "ID" },

    {
      key: "vehicle.old_number_plate",
      label: "Number Plate",
      render: (value, rowData) => (
        <p>
          {rowData.vehicleId}
        </p>
      ),
    },
    {
      key: "make",
      label: "Make",
      render: (value, rowData) => <p>{rowData.vehicleId}</p>,
    },
    {
      key: "make",
      label: "Created At",
      render: (value, rowData) => <p>{rowData.createdAt}</p>,
    },
    {
      key: "type",
      label: "Type",
      render: (value, rowData) => <p>{rowData.vehicleId}</p>,
    },
    {
      key: "user_department",
      label: "User Department",
      render: (value, rowData) => <p>{rowData.vehicleId}</p>,
    },

    {
      key: "actions",
      label: "Actions",
      render: (value, rowData) => (
        <div className="d-flex align-items-center gap-2">
          {/* Edit Icon */}

          <Link to={`/fleet/jobcards/edit/${rowData.id}`}>
            <i class="mdi mdi-comment-edit-outline font-size-20 link-warning"></i>
          </Link>

          {/* View Details Icon */}
          <Link to={`/fleet/jobcards/${rowData.id}`}>
            <i class="mdi mdi-eye font-size-20"></i>
          </Link>

          {/* Delete Icon */}

          <a
            href="#"
            className=""
            onClick={() => {
              setCurrentId(rowData.id);
              setShowModal(true);
            }}
          >
            <i class="mdi mdi-trash-can font-size-20 link-danger"></i>
          </a>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        lg="Delete"
        title=""
      >
        <div className="">
          <p className="lead text-secondary fw-bold">
            Are You Sure You want to Delete This job card
          </p>
          <div className="d-flex align-items-end justify-content-end gap-2">
            {" "}
            <btn
              onClick={() => setShowModal(false)}
              className="btn btn-warning btn-primary"
            >
              Cancel
            </btn>
            <btn
              onClick={() => handleDelete(currentId)}
              className="btn btn-primary"
            >
              Continue
            </btn>
          </div>
        </div>
      </FNModal>

      <div class="row">
        <div class="col-12">
          <div class="page d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Job cards</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <Link to="/ict/jobcards">Vehicles</Link>
                </li>
                <li class="breadcrumb-item active">Job Card</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="row mb-2">
                    {/* <div class="col-sm-4">
                      <div class="search-box me-2 mb-2 d-inline-block">
                        <div class="position-relative">
                          <input
                            type="text"
                            class="form-control"
                            id="searchTableList"
                            placeholder="Search..."
                          />
                          <i class="bx bx-search-alt search-icon"></i>
                        </div>
                      </div>
                    </div> */}
                    <div class="col-12  d-flex align-items-center justify-content-end gap-4">
                      <button
                        type="submit"
                        class="btn btn-warning btn-sm waves-effect waves-light d-flex align-items-center gap-2"
                        onClick={handleDownload}
                      >
                        <Download /> Download
                      </button>

                      <Link to="/fleet/jobcard" class="text-sm-end">
                        <button
                          type="submit"
                          class="btn btn-primary btn-sm d-flex align-items-center gap-2 waves-effect waves-light"
                          // onClick={handleShow}
                        >
                          <CirclePlus /> Add Job Card
                        </button>
                      </Link>
                    </div>
                  </div>
                  {loading ? (
                    <FNSpinner />
                  ) : (
                    <EnhancedTable data={jobcards} columns={columns} />
                    // <FNTable
                    //   columns={tableColumns}
                    //   data={jobcards}
                    //   onViewDetails={jobCardDetails}
                    //   handleEdit={jobCardAdd}
                    //   handleUpdate={jobCardUpdate}
                    //   title1="View Details"
                    //   title2="Add Proforma"
                    // />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
    // <div className="row">
    //   <div className="col-8">
    //     {" "}

    //   </div>
    //   <div className="col-4">
    //     <pre className="mt-4 p-3 bg-light rounded">
    //       {JSON.stringify(jobcards, null, 2)}
    //     </pre>
    //   </div>
    // </div>
  );
};

export default JobCardPage;
