import React, { useState, useEffect } from 'react'
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal'
import AddDisposal from './Popups/AddDisposal';
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';
import FNEmpty from '../../../components/FNEmpty';

const Disposal = ({ id }) => {
  const [disposal, setDisposal] = useState([]);
  const [loading, setLoading] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const loadDisposal = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/disposal/asset/${id}`);
      setDisposal(res.data.disposal);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisposal();
  }, []);

  const tableColumns = [
    { key: 'disposalDate', label: 'Disposal Date' },
    { key: 'disposalMethod', label: 'Disposal Method' },
    { key: 'disposalCost', label: 'Disposal Cost' },
    { key: 'disposalReason', label: 'Disposal Reason' }
  ];
  return (
    <div class="tab-pane" id="disposal" role="tabpanel">
      <FNModal
        showModal={showModal}
        handleClose={handleClose}
        lg="lg"
        title="Disposal Asset"
      >
        <AddDisposal close={handleClose} disposal={loadDisposal} id={id} />
      </FNModal>
      {loading ? <FNSpinner /> :
        <>
          <div class="card">
            <div class="card-body">
              {disposal.length > 0 ? <FNTable columns={tableColumns} data={disposal} /> :
                <FNEmpty
                  title='Asset Not Yet Disposed Off'
                  title1='No Dispose Has Been Done for this Asset Yet'
                  title2='Dispose Asset'
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

export default Disposal