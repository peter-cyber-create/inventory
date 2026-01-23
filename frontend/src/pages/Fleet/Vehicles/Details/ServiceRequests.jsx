import React, { useEffect, useState } from "react";
import API from "../../../../helpers/api";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import FNSpinner from "../../../../components/FNSpinner";
import EnhancedTable from "../../../../components/FNTable/EnhancedTable";

function ServiceRequests({vehicle}) {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState([]);
  const [id, setId] = useState("");

  const history = useHistory();

  const loadRequistion = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/v/service/request');
      console.log(res);
      setService(res.data.service);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleView = (id) => {
    history.push(`/fleet/requistion/${id}`);
  };

  const handleDelete = async (id) => {
    setId(id);
    setLoading(true);
    try {
      const res = await API.delete(`/v/service/${id}`);
      loadRequistion();
      setLoading(false);
      toast.success('Service Requistion Has Been Deleted Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error Encountered while Delete Service Requistion Request");
    }
  };

  const tableColumns = [
    { key: "vehicle.old_number_plate", label: "Number Plate" },
    // { key: 'department.name', label: 'Department' },
    { key: "createdAt", label: "Request Date" },
    { key: "driver", label: "Request Driver" },
    // { key: 'vdriver.phoneNo', label: 'Driver Phone No' },
    { key: "currentMileage", label: "Current Mileage" },
    { key: "previousMileage", label: "Previous Mileage" },
  ];

  const filteredServices = service.filter(
    (item) => item.vehicleId === vehicle.id
  );
  console.log("current vehicle ==", filteredServices);
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
  useEffect(() => {
    loadRequistion();
  }, []);
  return (
    <div class="tab-pane" id="services" role="tabpanel">
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
                            {filteredServices?.map((srv) => (
                              <tr>
                                <th scope="row">
                                  {vehicle?.old_number_plate ||
                                    vehicle?.new_number_plate}
                                </th>
                                <td>{srv.createdAt}</td>
                                <td>{srv.driver}</td>
                                <td>{srv.currentMileage}</td>
                                <td>{srv.previousMileage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table> */}
                      </div>
                      <EnhancedTable data={filteredServices} columns={columns} />
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

export default ServiceRequests;

// import React, { useState } from 'react'
// import FNModal from '../../../../components/FNModal'
// import AddService from './Popups/AddService';

// const Service = () => {
//     const [showModal, setShowModal] = useState(false);

//     const handleShow = () => setShowModal(true);
//     const handleClose = () => setShowModal(false);

//     const [rows, setRows] = useState([
//         { id: 1, name: '', age: '', email: '' },
//     ]);

//     const addRow = () => {
//         setRows((prevRows) => [
//             ...prevRows,
//             { id: prevRows.length + 1, name: '', age: '', email: '' },
//         ]);
//     };

//     const deleteRow = (id) => {
//         setRows((prevRows) => prevRows.filter((row) => row.id !== id));
//     };

//     const handleInputChange = (id, field, value) => {
//         setRows((prevRows) =>
//             prevRows.map((row) =>
//                 row.id === id ? { ...row, [field]: value } : row
//             )
//         );
//     };

//     return (
//         <div class="tab-pane" id="services" role="tabpanel">
//             <div className="row">
//                 <FNModal
//                     showModal={showModal}
//                     handleClose={handleClose}
//                     lg=""
//                     title="Add Service Details"
//                 >
//                     <AddService close={handleClose} />
//                 </FNModal>
//                 <div class="col-12">
//                     <div class="card">
//                         <div class="card-body">
//                             <div class="btn-toolbar">
//                                 <div class="btn-group text-right ms-auto mb-2">
//                                     <button class="btn btn-primary" onClick={handleShow}>Add Service</button>
//                                 </div>
//                             </div>
//                             {/* <div class="table-responsive">
//                                 <table class="table table-bordered border-primary mb-0">

//                                     <thead>
//                                         <tr style={{ backgroundColor: '#f2f2f2' }}>
//                                             <th>Serial No</th>
//                                             <th>Engranved No</th>
//                                             <th>Asset Name</th>
//                                             <th>Current User</th>
//                                             <th>Department</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <th scope="row">1</th>
//                                             <td>Mark</td>
//                                             <td>Mark</td>
//                                             <td>Otto</td>
//                                             <td>@mdo</td>
//                                         </tr>
//                                         <tr>
//                                             <th scope="row">2</th>
//                                             <td>Jacob</td>
//                                             <td>Mark</td>
//                                             <td>Thornton</td>
//                                             <td>@fat</td>
//                                         </tr>
//                                         <tr>
//                                             <th scope="row">3</th>
//                                             <td>Larry</td>
//                                             <td>Mark</td>
//                                             <td>the Bird</td>
//                                             <td>@twitter</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div> */}
//                             <div>
//                                 <button onClick={addRow}>Add Row</button>
//                                 <table>
//                                     <thead>
//                                         <tr>
//                                             <th>Name</th>
//                                             <th>Age</th>
//                                             <th>Email</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {rows.map((row) => (
//                                             <tr key={row.id}>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         value={row.name}
//                                                         onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         value={row.age}
//                                                         onChange={(e) => handleInputChange(row.id, 'age', e.target.value)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <input
//                                                         type="text"
//                                                         value={row.email}
//                                                         onChange={(e) => handleInputChange(row.id, 'email', e.target.value)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <button onClick={() => deleteRow(row.id)}>Delete</button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Service
