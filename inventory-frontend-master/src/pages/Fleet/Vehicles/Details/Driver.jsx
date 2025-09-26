import React, { useState } from 'react'
import FNModal from '../../../../components/FNModal'
import AssignDriver from './Popups/AssignDriver';

const Driver = ({ id, vehicle }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <div class="tab-pane" id="driver" role="tabpanel">
            <div className="row">
                <FNModal
                    showModal={showModal}
                    handleClose={handleClose}
                    lg="lg"
                    title="Re Assign Driver To Vehicle "
                >
                    <AssignDriver close={handleClose} id={id} vehicle={vehicle} />
                </FNModal>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="btn-toolbar">
                                <div class="btn-group text-right ms-auto mb-2">
                                    <button class="btn btn-primary" onClick={handleShow}>Re-Assign Driver</button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered border-primary mb-0">
                                    <tbody>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>User Department</th>
                                            <td>{vehicle.user_department && vehicle.user_department}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Driver</th>
                                            <td>{vehicle.driver}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Contact</th>
                                            <td>{vehicle.contact}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Driver