import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../helpers/api';
import { toast } from 'react-toastify';
import FNSpinner from '../../components/FNSpinner';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import InstitutionalModal from '../../components/Common/InstitutionalModal';
import AddAsset from './AddAsset';
import EditAsset from './EditAsset';
import '../../theme/moh-institutional-theme.css';

const AssetsInventory = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const history = useHistory();

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await API.get('/asset');
      setAssets(res.data.assets || []);
    } catch (error) {
      console.error('Error loading assets', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    history.push(`/ict/assets/${id}`);
  };

  const handleOpenCreate = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
  };

  const handleOpenEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedId(null);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      asset.serialNo?.toLowerCase().includes(term) ||
      asset.engranvedNo?.toLowerCase().includes(term) ||
      asset.category?.toLowerCase().includes(term) ||
      asset.make?.toLowerCase().includes(term) ||
      asset.model?.toLowerCase().includes(term) ||
      asset.user?.toLowerCase().includes(term) ||
      asset.department?.toLowerCase().includes(term) ||
      asset.officeNo?.toLowerCase().includes(term)
    );
  });

  const tableColumns = [
    { key: 'serialNo', label: 'Serial No', sortable: true },
    { key: 'engranvedNo', label: 'Engraved No', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'make', label: 'Make', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'officeNo', label: 'Office No', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleView(row.id)}
          >
            View
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleOpenEdit(row.id)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Uganda Flag Stripe */}
      <div
        style={{
          height: '6px',
          background:
            'linear-gradient(to right, var(--uganda-black) 0%, var(--uganda-black) 33.33%, var(--uganda-yellow) 33.33%, var(--uganda-yellow) 66.66%, var(--uganda-red) 66.66%, var(--uganda-red) 100%)',
          marginBottom: 'var(--space-6)',
        }}
      />

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            ICT Assets Listing
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Official register of ICT assets with location and assignment details
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          + Add New Asset
        </button>
      </div>

      {/* Search and Filters */}
      <div
        className="card"
        style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}
      >
        <div className="card-body">
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by serial, category, user, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <FNSpinner />
      ) : (
        <InstitutionalTable
          data={filteredAssets}
          columns={tableColumns}
          loading={loading}
          sortable={true}
          filterable={false}
          pagination={true}
          pageSize={10}
          onRowClick={(row) => handleView(row.id)}
          emptyMessage="No ICT assets found"
        />
      )}

      {/* Create Asset Modal */}
      <InstitutionalModal
        visible={showCreateModal}
        onClose={handleCloseCreate}
        title="Add ICT Asset"
        width={900}
      >
        <AddAsset close={handleCloseCreate} refresh={loadAssets} />
      </InstitutionalModal>

      {/* Edit Asset Modal */}
      <InstitutionalModal
        visible={showEditModal}
        onClose={handleCloseEdit}
        title="Edit ICT Asset"
        width={800}
      >
        {selectedId && (
          <EditAsset close={handleCloseEdit} refresh={loadAssets} id={selectedId} />
        )}
      </InstitutionalModal>
    </div>
  );
};

export default AssetsInventory;