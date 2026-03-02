import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import FormSectionCollapsible from '../../components/ui/FormSectionCollapsible';
import FormField from '../../components/ui/FormField';
import FormActions from '../../components/ui/FormActions';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

const STATUS_OPTIONS = ['open', 'closed'];

export default function FleetJobCards() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', vehicleId: '' });
  const [form, setForm] = useState({
    vehicleId: '',
    issueDescription: '',
    assignedToId: '',
    startDate: '',
    status: 'open',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getUser();

  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.vehicleId) params.vehicleId = filters.vehicleId;
    api
      .get('/api/fleet/job-cards', { params })
      .then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? [])))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [filters.status, filters.vehicleId]);

  useEffect(() => {
    api.get('/api/fleet/vehicles', { params: { limit: 500 } }).then((res) => {
      const raw = res.data;
      setVehicles(Array.isArray(raw) ? raw : (raw?.data ?? []));
    }).catch(() => setVehicles([]));
    api.get('/api/admin/users', { params: { limit: 500 } }).then((res) => {
      const raw = res.data;
      const d = Array.isArray(raw) ? raw : (raw?.data ?? []);
      setUsers(d);
    }).catch(() => setUsers([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      vehicleId: '',
      issueDescription: '',
      assignedToId: '',
      startDate: '',
      status: 'open',
      endDate: '',
    });
    setShowForm(true);
    setError('');
  };

  const openEdit = (j) => {
    setEditing(j);
    setForm({
      vehicleId: j.vehicleId ?? '',
      issueDescription: j.issueDescription ?? '',
      assignedToId: j.assignedToId ?? '',
      startDate: j.startDate ? new Date(j.startDate).toISOString().slice(0, 10) : '',
      status: j.status ?? 'open',
      endDate: j.endDate ? new Date(j.endDate).toISOString().slice(0, 10) : '',
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.vehicleId) {
      setError('Select a vehicle.');
      return;
    }
    setSubmitting(true);
    const payload = { vehicleId: form.vehicleId };
    if (form.issueDescription.trim()) payload.issueDescription = form.issueDescription.trim();
    if (form.assignedToId) payload.assignedToId = form.assignedToId;
    else if (editing) payload.assignedToId = null;
    if (form.startDate) payload.startDate = form.startDate;
    if (form.endDate) payload.endDate = form.endDate;
    if (form.status) payload.status = form.status;

    const then = () => {
      setShowForm(false);
      setEditing(null);
      load();
    };
    const req = editing
      ? api.patch(`/api/fleet/job-cards/${editing.id}`, payload)
      : api.post('/api/fleet/job-cards', payload);
    req
      .then(then)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const handleClose = (j) => {
    if (!window.confirm('Close this job card?')) return;
    api
      .post(`/api/fleet/job-cards/${j.id}/close`)
      .then(load)
      .catch((err) => setError(err.response?.data?.error || err.message));
  };

  const docNumber = editing ? (editing.id?.slice(0, 8) ?? '—') : '—';
  const vehicleLabel = editing?.vehicle ? `${editing.vehicle.registrationNumber} – ${editing.vehicle.make} ${editing.vehicle.model}` : (form.vehicleId ? vehicles.find((v) => v.id === form.vehicleId)?.registrationNumber : '—');

  return (
    <PageLayout
      title="Fleet Job Cards"
      actions={
        <button type="button" onClick={openCreate} className="ims-btn-primary">
          Add Job Card
        </button>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      <div className="ims-card p-4 mb-4 flex flex-wrap gap-4 items-end">
        <FormField label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="ims-input py-1.5 min-w-[100px]"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Vehicle">
          <select
            value={filters.vehicleId}
            onChange={(e) => setFilters((f) => ({ ...f, vehicleId: e.target.value }))}
            className="ims-input py-1.5 min-w-[200px]"
          >
            <option value="">All vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} – {v.make} {v.model}
              </option>
            ))}
          </select>
        </FormField>
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Job Card' : 'New Job Card'} onClose={() => { setShowForm(false); setEditing(null); }} width="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber={docNumber}
              status={editing?.status ?? form.status ?? 'Draft'}
              createdBy={editing?.createdBy ?? currentUser?.name ?? '—'}
              department={currentUser?.department?.name ?? '—'}
              date={editing?.createdAt ? new Date(editing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              referenceCode={vehicleLabel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="jc-vehicle" title="Section A – Vehicle & Issue" defaultOpen={true}>
                  <FormField label="Vehicle" required>
                    <select
                      required
                      value={form.vehicleId}
                      onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
                      className="ims-input"
                      disabled={!!editing}
                    >
                      <option value="">— Select vehicle —</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} – {v.make} {v.model}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Issue / work requested" className="md:col-span-2">
                    <textarea
                      rows={3}
                      value={form.issueDescription}
                      onChange={(e) => setForm((f) => ({ ...f, issueDescription: e.target.value }))}
                      className="ims-input"
                    />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="jc-assignment" title="Section B – Assignment & Dates" defaultOpen={true}>
                  <FormField label="Assigned technician">
                    <select
                      value={form.assignedToId}
                      onChange={(e) => setForm((f) => ({ ...f, assignedToId: e.target.value }))}
                      className="ims-input"
                    >
                      <option value="">— None —</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className="ims-input"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Start date">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="ims-input"
                    />
                  </FormField>
                  <FormField label="End date">
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="ims-input"
                    />
                  </FormField>
                </FormSectionCollapsible>

                <FormActions className="mt-4">
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="ims-btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
                </FormActions>
              </div>
              <div>
                <AuditTrailPanel
                  createdBy={editing?.createdBy ?? currentUser?.name}
                  createdAt={editing?.createdAt}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-hidden">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Issue</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Assigned To</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Start</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">End</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((j) => (
                <tr key={j.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {j.vehicle?.registrationNumber} – {j.vehicle?.make} {j.vehicle?.model}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">{j.issueDescription || '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{j.assignedTo?.name || '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{j.startDate ? new Date(j.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{j.endDate ? new Date(j.endDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{j.status}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    <button type="button" onClick={() => openEdit(j)} className="text-gov-accent hover:underline text-body-sm mr-2">Edit</button>
                    {j.status !== 'closed' && (
                      <button type="button" onClick={() => handleClose(j)} className="text-gov-secondary hover:underline text-body-sm">Close</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">No job cards.</p>}
        </div>
      )}
    </PageLayout>
  );
}
