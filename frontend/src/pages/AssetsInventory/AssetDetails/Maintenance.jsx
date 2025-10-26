import React, { useState, useEffect } from 'react'
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal'
import AddMaintenance from './Popups/AddMaintenance';
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';
import FNEmpty from '../../../components/FNEmpty';

const Maintenance = ({ id }) => {
    const [maintenance, setMaintenance] = useState([]);
    const [loading, setLoading] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const loadMaintenance = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/maintenance/asset/${id}`);
            setMaintenance(res.data.maintenance);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaintenance();
    }, []);

    const tableColumns = [
        { key: 'taskName', label: 'Task Name' },
        { key: 'servicedOn', label: 'Serviced On' },
        { key: 'servicedBy', label: 'Serviced By' },
        { key: 'nextService', label: 'Next Service Date' },

    ];
    return (
        <div class="tab-pane" id="maintenance" role="tabpanel">
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Add Preventive Maintenance Details"
            >
                <AddMaintenance close={handleClose} maintenance={loadMaintenance} id={id} />
            </FNModal>
            {loading ? <FNSpinner /> :
                <>
                    <div class="card">
                        <div class="card-body">
                            {maintenance.length > 0 ?
                                <>
                                    <div className="row">
                                        <div class="d-flex justify-content-end p-2">
                                            <button class="btn btn-primary" type="button" onClick={handleShow}>
                                                <i class="bx bxs-cog align-middle me-1"></i> Add Maintenance
                                            </button>
                                        </div>
                                    </div>

                                    <FNTable columns={tableColumns} data={maintenance} />
                                </>
                                :
                                <FNEmpty
                                    title='No Preventive Maintenance Done'
                                    title1='No Preventive Maintenance Has been done for this asset yet'
                                    title2='Add Preventive Maintenance'
                                    open={handleShow}
                                />
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Maintenance