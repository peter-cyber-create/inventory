import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import API from "../../../../helpers/api";
import FNModal from "../../../../components/FNModal";
import FNSpinner from '../../../../components/FNSpinner'
import AddDept from './AddDept';

const Depts = () => {
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showOpen, setShowOpen] = useState(false);

    const show = () => setShowOpen(true);
    const close = () => setShowOpen(false);

    const history = useHistory();

    const handleDelete = async (id) => {
        setLoading(true);
        await API.delete(`/monitoring/template/config/delete/${id}`)
            .then(() => {
                setLoading(false);
                toast.success('Monitoring Template Successfully Deleted');
            })
            .catch((error) => {
                setLoading(false);
                toast.error(`Error Encountered While Deleting Monitoring Template`);
            });
        loadDepts();
    };

    const loadDepts = async () => {
        setLoading(true);
        try {
            const res = await API.get("/department");
            console.log(res)
            setDepts(res?.data.depts);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    const viewDetails = (id) => {
        history.push(`/ict/departments/${id}`);
    };

    const handleUpdate = (id) => {
        history.push(`/monitoring/template/update/${id}`);
    };

    useEffect(() => {
        loadDepts();
    }, []);

    return (
        <Fragment>
            <FNModal
                showModal={showOpen}
                handleClose={close}
                lg="lg"
                title="Add MOH HQ Department"
            >
                <AddDept close={close} refresh={loadDepts} />
            </FNModal>
            <div class="row">
                <div class="col-12">
                    <div class="page d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">MOH HQ Departments </h4>
                        <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><Link to="/ict/departments">Back To Departments</Link></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? <FNSpinner /> :
                <>
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
                                                <button type="submit" class="btn btn-primary waves-effect waves-light" onClick={show}>Add Department</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table align-middle table-striped table-sm">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Department ID</th>
                                                    <th>Department Name</th>
                                                    <th className="align-middle">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {depts && depts.map((dept, index) => (
                                                    <tr key={index}>
                                                        <td>{dept.id}</td>
                                                        <td>{dept.name}</td>
                                                        <td>
                                                            <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                <a onClick={() => viewDetails(dept.id)} class="action-icon text-warning" style={{ cursor: 'pointer' }}>
                                                                    <i class="mdi mdi-eye font-size-20"></i></a>
                                                            </div>
                                                            <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                <a onClick={() => handleUpdate(dept.id)} class="action-icon text-warning" style={{ cursor: 'pointer' }}>
                                                                    <i class="mdi mdi-comment-edit-outline font-size-20"></i></a>
                                                            </div>
                                                            <div class="d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top">
                                                                <a onClick={() => handleDelete(dept.id)} class="action-icon text-danger" style={{ cursor: 'pointer' }}>
                                                                    <i class="mdi mdi-trash-can font-size-20"></i></a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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

export default Depts