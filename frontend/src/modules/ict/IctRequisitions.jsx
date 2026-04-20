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
import StatusChip from '../../components/ui/StatusChip';

export default function IctRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetType: '', quantity: 1, justification: '', requisitionType: 'Standard' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const currentUser = getUser();

  const load = () => {
    const params = {};
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    api
      .get('/api/ict/requisitions', { params })
      .then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? [])))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const isEmergency = (form.requisitionType || '').toLowerCase() === 'emergency';
    if (isEmergency && !form.justification?.trim()) {
      setError('Justification is required for Emergency requisitions.');
      return;
    }
    setSubmitting(true);
    const payload = { assetType: form.assetType.trim(), quantity: Number(form.quantity) || 1 };
    if (form.justification.trim()) payload.justification = form.justification.trim();
    api
      .post('/api/ict/requisitions', payload)
      .then(() => {
        setShowForm(false);
        setForm({ assetType: '', quantity: 1, justification: '', requisitionType: 'Standard' });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const isEmergency = (form.requisitionType || '').toLowerCase() === 'emergency';

  return (
    <PageLayout
      title="ICT Requisitions"
      subtitle="Review pending requests and act through a clear approval workflow."
      actions={
        <button type="button" onClick={() => { setShowForm(true); setError(''); }} className="ims-btn-primary">
          Create Requisition
        </button>
      }
    >
      {showForm && (
        <Modal title="New ICT Requisition" onClose={() => setShowForm(false)} width="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber="—"
              status="Draft"
              createdBy={currentUser?.name ?? '—'}
              department={currentUser?.department?.name ?? '—'}
              date={new Date().toLocaleDateString()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="ict-req-details" title="Section A – Request details" defaultOpen={true}>
                  <FormField label="Requisition type">
                    <select value={form.requisitionType} onChange={(e) => setForm((f) => ({ ...f, requisitionType: e.target.value }))} className="ims-input">
                      <option value="Standard">Standard</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </FormField>
                  <FormField label="Asset type" required>
                    <input type="text" required value={form.assetType} onChange={(e) => setForm((f) => ({ ...f, assetType: e.target.value }))} placeholder="e.g. Laptop, Monitor" className="ims-input" />
                  </FormField>
                  <FormField label="Quantity" required>
                    <input type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value, 10) || 1 }))} className="ims-input" />
                  </FormField>
                  <FormField label="Justification" required={isEmergency}>
                    <textarea value={form.justification} onChange={(e) => setForm((f) => ({ ...f, justification: e.target.value }))} rows={3} className="ims-input" placeholder={isEmergency ? 'Required for emergency requisitions' : 'Optional'} />
                  </FormField>
                </FormSectionCollapsible>

                <FormActions className="mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="ims-btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Submitting…' : 'Submit'}</button>
                </FormActions>
              </div>
              <div>
                <AuditTrailPanel createdBy={currentUser?.name} />
              </div>
            </div>
          </form>
        </Modal>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-label text-gov-secondary">Filter:</span>
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setLoading(true);
              setStatusFilter(opt.value);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              statusFilter === opt.value
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'bg-gov-backgroundAlt text-gov-secondary border-gov-border hover:border-gov-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-hidden">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Asset Type</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Requester</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((r) => (
                <tr key={r.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{r.assetType}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.quantity}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.requester?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusChip status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {String(r.status).toLowerCase() === 'pending' ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            api
                              .patch(`/api/ict/requisitions/${r.id}/status`, { status: 'approved' })
                              .then(load)
                              .catch(() => {});
                          }}
                          className="ims-btn-primary px-3 py-1 text-body-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            api
                              .patch(`/api/ict/requisitions/${r.id}/status`, { status: 'rejected' })
                              .then(load)
                              .catch(() => {});
                          }}
                          className="ims-btn-secondary px-3 py-1 text-body-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-label text-gov-secondaryMuted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">No requisitions.</p>}
        </div>
      )}
    </PageLayout>
  );
}
