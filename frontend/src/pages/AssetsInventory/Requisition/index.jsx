import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import API from "../../../helpers/api";
import FNCard from "../../../components/FNCard";
import FNModal from "../../../components/FNModal";
import AddRequisition from "./AddRequisition";
import FNSpinner from "../../../components/FNSpinner";
import FNTable from "../../../components/FNTable";

const Requisition = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requistions, setRequisitions] = useState([]);
  const [id, setId] = useState("");
  const [model, setModel] = useState("");
  const [serialNo, setSerialNo] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const loadAsset = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/requisition/asset/${id}`);
      console.log(res);
      setModel(res?.data.asset.model.name);
      setSerialNo(res?.data.asset.serialNo);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleView = (id) => {
    handleShow();
    setId(id);
    loadAsset(id);
  };

  const loadRequisition = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/requisition/it/assets`);
      console.log(res);
      // Ensure we always set an array, even if API fails
      setRequisitions(res?.data?.assets || []);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      // Set empty array on error to prevent undefined errors
      setRequisitions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequisition();
  }, []);

  const tableColumns = [
    { key: "category.name", label: "Category" },
    { key: "brand.name", label: "Brand" },
    { key: "model.name", label: "Model" },
    { key: "serialNo", label: "Serial No" },
    { key: "engravedNo", label: "Engraved No" },
    { key: "funder", label: "Funder" },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg=""
        title="Request Item From Stores"
      >
        <AddRequisition
          close={handleClose}
          refresh={loadRequisition}
          id={id}
          model={model}
          serialNo={serialNo}
          setModel={setModel}
          setSerialNo={setSerialNo}
        />
      </FNModal>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Stores Requisition Listing</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <Link to="/ict/assets">Stores Requisition</Link>
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
                      </div>
                      {!requistions || requistions.length === 0 ? (
                        <FNCard text="No Requisitions For Assets Yet! " />
                      ) : (
                        <FNTable
                          columns={tableColumns}
                          data={requistions}
                          onViewDetails={handleView}
                          text="Place Requisition"
                        />
                      )}
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

export default Requisition;
