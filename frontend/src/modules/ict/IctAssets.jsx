import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import FormField from '../../components/ui/FormField';
import FormActions from '../../components/ui/FormActions';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import FormSectionCollapsible from '../../components/ui/FormSectionCollapsible';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

const STATUS_OPTIONS = ['available', 'assigned', 'maintenance'];
const CATEGORY_OPTIONS = ['Laptop', 'Desktop', 'Tablet', 'Server', 'Monitor', 'Printer', 'Network', 'Other'];

export default function IctAssets() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    assetTag: '', name: '', category: '', serialNumber: '', status: 'available',
    location: '', assignedToId: '', purchaseDate: '',
    cost: '', fundingSource: '', procurementRef: '',
    rackLocation: '', ipAddress: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const currentUser = getUser();

  const load = (p = page, q = search) => {
    setLoading(true);
    const params = { page: p, limit };
    if (q) params.search = q;
    api.get('/api/ict/assets', { params })
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setList(Array.isArray(d) ? d : []);
        setTotal(res.data?.total ?? d?.length ?? 0);
        setPage(res.data?.page ?? p);
      })
      .catch(() => { setList([]); setTotal(0); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(1, search); }, [search]);

  useEffect(() => {
    if (showForm || editing) {
      api.get('/api/admin/users', { params: { limit: 500 } }).then((res) => {
        const d = res.data?.data ?? res.data;
        setUsers(Array.isArray(d) ? d : []);
      }).catch(() => setUsers([]));
    }
  }, [showForm, editing]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      assetTag: '', name: '', category: '', serialNumber: '', status: 'available',
      location: '', assignedToId: '', purchaseDate: '',
      cost: '', fundingSource: '', procurementRef: '', rackLocation: '', ipAddress: '',
    });
    setShowForm(true);
    setError('');
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      assetTag: a.assetTag,
      name: a.name,
      category: a.category ?? '',
      serialNumber: a.serialNumber ?? '',
      status: a.status ?? 'available',
      location: a.location ?? '',
      assignedToId: a.assignedToId ?? '',
      purchaseDate: a.purchaseDate ? new Date(a.purchaseDate).toISOString().slice(0, 10) : '',
      cost: a.cost ?? '',
      fundingSource: a.fundingSource ?? '',
      procurementRef: a.procurementRef ?? '',
      rackLocation: a.rackLocation ?? '',
      ipAddress: a.ipAddress ?? '',
    });
    setShowForm(true);
    setError('');
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (a) => {
    if (!window.confirm(`Delete asset "${a.assetTag}"?`)) return;
    api.delete(`/api/ict/assets/${a.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      assetTag: form.assetTag.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      status: form.status,
    };
    if (form.serialNumber.trim()) payload.serialNumber = form.serialNumber.trim();
    if (form.location.trim()) payload.location = form.location.trim();
    if (form.assignedToId) payload.assignedToId = form.assignedToId;
    else if (editing) payload.assignedToId = null;
    if (form.purchaseDate) payload.purchaseDate = form.purchaseDate;
    const then = () => { closeForm(); load(page, search); };
    const req = editing ? api.patch(`/api/ict/assets/${editing.id}`, payload) : api.post('/api/ict/assets', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  const isServer = (form.category || '').toLowerCase() === 'server';
  const docStatus = editing ? (editing.status || 'Draft') : 'Draft';
  const isLocked = false;

  const columns = [
    { key: 'assetTag', label: 'Asset Tag' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'location', label: 'Location', render: (r) => r.location ?? '—' },
    { key: 'assignedTo', label: 'Assigned To', render: (r) => r.assignedTo?.name ?? '—' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <span className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="text-gov-primary hover:underline text-body-sm">Edit</button>
          <button type="button" onClick={() => handleDelete(r)} className="text-gov-danger hover:underline text-body-sm">Delete</button>
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="ICT Assets Inventory"
      actions={
        <>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Search tag, name, serial"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="ims-input w-48"
            />
            <button type="submit" className="ims-btn-secondary">Search</button>
          </form>
          <button type="button" onClick={openCreate} className="ims-btn-primary">Add Asset</button>
        </>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {showForm && (
        <Modal title={editing ? 'Edit ICT Asset' : 'Asset Registration'} onClose={closeForm} width="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber={editing?.assetTag ?? '—'}
              status={docStatus}
              createdBy={editing?.createdBy ?? currentUser?.name ?? '—'}
              department={editing?.department ?? currentUser?.department?.name ?? '—'}
              date={editing?.createdAt ? new Date(editing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              referenceCode={editing?.id ? editing.id.slice(0, 8) : '—'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="sec-identity" title="Section A – Asset Identity" defaultOpen={true}>
                  <FormField label="Asset code (tag)" required>
                    <input type="text" required value={form.assetTag} onChange={(e) => setForm((f) => ({ ...f, assetTag: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  <FormField label="Category" required>
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="ims-input" required disabled={isLocked}>
                      <option value="">— Select —</option>
                      {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Name / Model" required>
                    <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  <FormField label="Serial number">
                    <input type="text" value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  {isServer && (
                    <>
                      <FormField label="Rack location">
                        <input type="text" value={form.rackLocation} onChange={(e) => setForm((f) => ({ ...f, rackLocation: e.target.value }))} className="ims-input" disabled={isLocked} />
                      </FormField>
                      <FormField label="IP address">
                        <input type="text" value={form.ipAddress} onChange={(e) => setForm((f) => ({ ...f, ipAddress: e.target.value }))} className="ims-input" disabled={isLocked} placeholder="e.g. 10.0.0.1" />
                      </FormField>
                    </>
                  )}
                </FormSectionCollapsible>

                <FormSectionCollapsible id="sec-financial" title="Section B – Financial Information" defaultOpen={true}>
                  <FormField label="Cost">
                    <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  <FormField label="Funding source">
                    <input type="text" value={form.fundingSource} onChange={(e) => setForm((f) => ({ ...f, fundingSource: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  <FormField label="Procurement reference">
                    <input type="text" value={form.procurementRef} onChange={(e) => setForm((f) => ({ ...f, procurementRef: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="sec-assignment" title="Section C – Assignment" defaultOpen={true}>
                  <FormField label="Location">
                    <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                  <FormField label="Assigned to">
                    <select value={form.assignedToId} onChange={(e) => setForm((f) => ({ ...f, assignedToId: e.target.value }))} className="ims-input" disabled={isLocked}>
                      <option value="">— None —</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                    </select>
                  </FormField>
                  <FormField label="Status">
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="ims-input" disabled={isLocked}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="sec-lifecycle" title="Section D – Lifecycle" defaultOpen={false}>
                  <FormField label="Purchase date">
                    <input type="date" value={form.purchaseDate} onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))} className="ims-input" disabled={isLocked} />
                  </FormField>
                </FormSectionCollapsible>

                <FormActions className="mt-4">
                  <button type="button" onClick={closeForm} className="ims-btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
                </FormActions>
              </div>
              <div>
                <AuditTrailPanel
                  createdBy={editing?.createdBy ?? currentUser?.name}
                  createdAt={editing?.createdAt}
                  modifiedBy={editing?.modifiedBy}
                  modifiedAt={editing?.updatedAt}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        emptyMessage="No assets recorded."
        searchSlot={null}
        paginationSlot={
          total > limit ? (
            <div className="flex items-center gap-2 text-body-sm text-gov-secondary">
              <span>{list.length} of {total}</span>
              <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Prev</button>
              <span>Page {page}</span>
              <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Next</button>
            </div>
          ) : null
        }
      />
    </PageLayout>
  );
}
