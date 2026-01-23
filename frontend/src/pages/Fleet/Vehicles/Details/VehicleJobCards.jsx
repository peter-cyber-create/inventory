import React, { useEffect, useState } from "react";
import API from "../../../../helpers/api";
import { Link, useHistory } from "react-router-dom";
import FNSpinner from "../../../../components/FNSpinner";
import EnhancedTable from "../../../../components/FNTable/EnhancedTable";
import { toast } from "react-toastify";

function VehicleJobCards({ vehicle }) {
  const [jobcards, setJobCards] = useState([]);
  const [loading, setLoading] = useState([]);

  const history = useHistory();

  const loadJobCards = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/jobcards');

      // const formattedJobs = res.data.job.map((job) => ({
      //   ...job,
      //   createdAt: moment(job.createdAt).format("YYYY-MM-DD'),
      //   //jobCard: job.id.substring(0, 8),
      //   // status: <span class="badge bg-warning">{ticket.status}</span>
      // }));
      console.log("/////////", res?.data?.results);
      setJobCards(res?.data?.results);
      setLoading(false);
    } catch (error) {
      console.log("error', error);
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    setLoading(true);
    try {
      const res = await API.delete(`/api/jobcards/${jobId}`);
      loadJobCards();
      toast.success('Job Card Deleted Successful');
    } catch (error) {
      console.log("error", error);
    }
  };

  const tableColumns = [
    // { key: 'department.name', label: 'Department' },
    { label: "Number Plate" },
    { label: "Driver" },
    { label: "Make" },

    { label: "Type" },
    { label: "Department" },
  ];
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
      key: "make",
      label: "Make",
      render: (value, rowData) => <p>{rowData.vehicle.make}</p>,
    },
    {
      key: "make",
      label: "Created At",
      render: (value, rowData) => <p>{rowData.vehicle.createdAt}</p>,
    },
    {
      key: "type",
      label: "Type",
      render: (value, rowData) => <p>{rowData.vehicle.type}</p>,
    },
    {
      key: "user_department",
      label: "User Department",
      render: (value, rowData) => <p>{rowData.vehicle.user_department}</p>,
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
            onClick={()=>handleDelete(rowData.id)}
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
  const filteredJobCards = jobcards.filter(
    (item) => item.vehicleId === vehicle.id
  );
  useEffect(() => {
    loadJobCards();
  }, []);
  console.log("current job card ==", filteredJobCards);

  return (
    <div class="tab-pane" id="jobcards" role="tabpanel">
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
                      <div class="table-responsive">
                        {/* <table class="table table-bordered border-primary mb-0">
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                              {tableColumns.map((col) => (
                                <th>{col.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredJobCards?.map((srv) => (
                              <tr>
                                <td scope="row">
                                  {vehicle?.old_number_plate ||
                                    vehicle?.new_number_plate}
                                </td>
                                <td>{srv.driverOrCustomerName}</td>
                                <td>{srv.vehicle.make}</td>
                                <td>{srv.vehicle.type}</td>
                                <td>{srv.vehicle.user_dapartment}</td>
                            
                              </tr>
                            ))}
                          </tbody>
                        </table> */}
                      </div>
                      <EnhancedTable
                        data={filteredJobCards}
                        columns={columns}
                      />
                      {/* <FNTable
                      columns={tableColumns}
                      data={filteredServices}
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
    </div>
  );
}

export default VehicleJobCards;
