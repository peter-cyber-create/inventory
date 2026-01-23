import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import API from "../../../../helpers/api";
import { toast } from "react-toastify";
import FNModal from "../../../../components/FNModal";
import FNSpinner from "../../../../components/FNSpinner";
import FNTable from "./FNTable";
import AddReceiving from "./AddReceiving";

const Receiving = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdate] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const updateClose = () => setUpdate(false);

  const history = useHistory();

  const loadRequistion = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/v/receive');
      console.log(res);
      setVehicles(res?.data.garage);
      setLoading(false);
    } catch (error) {
      console.log("error', error);
      setLoading(false);
    }
  };

  const handleView = (id) => {
    history.push(`/fleet/service/${id}`);
  };
  const handleDelete = async (id) => {
    
    setLoading(true);
    try {
      const res = await API.delete(`/v/receive/${id}`);
      loadRequistion();
      setLoading(false);
      toast.success('Service  Has Been Deleted Successfully');
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("Error Encountered while Delete Service Requistion Request");
    }
  };

  useEffect(() => {
    loadRequistion();
  }, []);
console.log("///////////////", vehicles)
  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg="lg"
        title="InHouse Garage Receiving Form"
      >
        <AddReceiving close={handleClose} refresh={loadRequistion} />
      </FNModal>
      <FNModal
        showModal={updateModal}
        handleClose={updateClose}
        lg="lg"
        title="Update Receiving"
      >
        {/* <EditServer close={updateClose} refresh={loadRequistion} id={id} /> */}
      </FNModal>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Garage Receiving Forms</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <Link to="/ict/vehicles">Vehicles</Link>
                </li>
                <li class="breadcrumb-item active">Receiving</li>
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
                        </div>
                        <div class="col-sm-8">
                          <div class="text-sm-end">
                            <Link to={`/fleet/receiving/create`}>
                              <button
                                type="submit"
                                class="btn btn-primary waves-effect waves-light"
                                // onClick={handleShow}
                              >
                                Add Garage Receiving
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <FNTable data={vehicles} handleView={handleView} handleDelete={handleDelete} />
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

export default Receiving;
