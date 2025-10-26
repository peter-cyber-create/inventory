import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import FNModal from '../../../../components/FNModal'
import API from "../../../../helpers/api";
import FNSpinner from '../../../../components/FNSpinner';
import FNTable from '../../../../components/FNTable';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEdit = (id) => {
    setId(id)
    setShowEdit(true)
  };

  const closeEdit = () => setShowEdit(false);

  const history = useHistory();

  const handleView = (id) => {
    history.push(`/fleet/vehicle/${id}`);
  };

  const handleDelete = async (id) => {
    setId(id)
    setLoading(true);
    try {
      const res = await API.delete(`/v/sparecategory/${id}`);
      console.log(res)
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/v/sparecategory`);
      const categories = res?.data.sparecategory.map(spare => ({
        ...spare,
        createdAt: moment(spare.createdAt).format('YYYY-MM-DD'),
      }));

      setCategories(categories);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const tableColumns = [
    { key: 'id', label: 'Spare Category ID' },
    { key: 'name', label: 'Spare Category Name' },
    { key: 'createdAt', label: 'Created At' },
  ];

  return (
    <Fragment>
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg=""
        title="Add Spare Part Category"
      >
        <AddCategory close={handleClose} refresh={loadCategories} />
      </FNModal>
      <FNModal
        showModal={showEdit}
        handleClose={closeEdit}
        lg="lg"
        title="Edit Spare Part Category Details"
      >
        <EditCategory close={closeEdit} refresh={loadCategories} id={id} />
      </FNModal>
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0 font-size-18">Ministry of Health Spare Parts Categories</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><Link to="/ict/assets">Categories</Link></li>
                <li class="breadcrumb-item active">Listing</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {loading ? <FNSpinner /> :
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
                              <input type="text" class="form-control" id="searchTableList" placeholder="Search..." />
                              <i class="bx bx-search-alt search-icon"></i>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-8">
                          <div class="text-sm-end">
                            <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={handleShow}>Add Spare Part Category</button>
                          </div>
                        </div>
                      </div>
                      <FNTable
                        columns={tableColumns}
                        data={categories}
                        handleEdit={handleEdit}
                        onViewDetails={handleView}
                        handleDelete={handleDelete}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </Fragment>
  )
}

export default Categories