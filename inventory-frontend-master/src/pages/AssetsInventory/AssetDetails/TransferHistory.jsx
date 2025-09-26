import React, { useState, useEffect } from 'react'
import API from "../../../helpers/api";
import FNModal from '../../../components/FNModal'
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';
import FNEmpty from '../../../components/FNEmpty';
import AddTransfer from './Popups/AddTransfer';

const TransferHistory = ({ id, asset }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState([]);
  const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/transfers/asset/${id}`);
      setTransfers(res.data.transfer);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const tableColumns = [
    { key: 'previousUser', label: 'Previous User' },
    { key: 'user', label: 'Current user' },
    { key: 'previousDept', label: 'Previous Dept' },
    { key: 'department', label: 'Current Department' },
    { key: 'email', label: 'Email' },
    { key: 'officeNo', label: 'Office No' }
  ];
  return (
    <div class="tab-pane" id="movement" role="tabpanel">
      <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Change Asset Ownership"
            >
                <AddTransfer close={handleClose} asset={asset} />
            </FNModal>
      {loading ? <FNSpinner /> :
        <>
          <div class="card">
            <div class="card-body">
              {transfers.length > 0 ? <FNTable columns={tableColumns} data={transfers} /> :
                <FNEmpty
                  title='No Asset Transfer'
                  title1='No Change of Asset Ownership for this Asset has taken place yet'
                  title2='Transfer Asset Ownership'
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

export default TransferHistory