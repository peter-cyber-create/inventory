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

export default function FleetRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    projectUnit: '',
    headOfDepartment: '',
    serviceRequestingOfficer: '',
    driverName: '',
    mobile: '',
    projectEmail: '',
    vehicleId: '',
    registrationNumber: '',
    currentMileage: '',
    lastServiceMileage: '',
    requestDate: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getUser();
  const [statusFilter, setStatusFilter] = useState('all');

  const load = () => {
    const params = {};
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    api
      .get('/api/fleet/requisitions', { params })
      .then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? [])))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [statusFilter]);

  useEffect(() => {
    if (showForm) {
      api.get('/api/fleet/vehicles', { params: { limit: 500 } })
        .then((res) => {
          const raw = res.data;
          setVehicles(Array.isArray(raw) ? raw : (raw?.data ?? []));
        })
        .catch(() => setVehicles([]));
    }
  }, [showForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectUnit.trim() || !form.headOfDepartment.trim() || !form.serviceRequestingOfficer.trim()) {
      setError('Project/unit, head of department, and requesting officer are required.');
      return;
    }
    if (!form.vehicleId) {
      setError('Select a vehicle.');
      return;
    }
    if (!form.requestDate) {
      setError('Select a request date.');
      return;
    }
    setSubmitting(true);
    const payload = {
      projectUnit: form.projectUnit.trim(),
      headOfDepartment: form.headOfDepartment.trim(),
      serviceRequestingOfficer: form.serviceRequestingOfficer.trim(),
      driverName: form.driverName.trim() || undefined,
      mobile: form.mobile.trim() || undefined,
      projectEmail: form.projectEmail.trim() || undefined,
      vehicleId: form.vehicleId || undefined,
      description: form.description.trim() || undefined,
      currentMileage: form.currentMileage !== '' ? Number(form.currentMileage) : undefined,
      lastServiceMileage: form.lastServiceMileage !== '' ? Number(form.lastServiceMileage) : undefined,
      requestDate: form.requestDate || undefined,
    };
    api
      .post('/api/fleet/requisitions', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          projectUnit: '', headOfDepartment: '', serviceRequestingOfficer: '', driverName: '', mobile: '', projectEmail: '',
          vehicleId: '', registrationNumber: '', currentMileage: '', lastServiceMileage: '', requestDate: '', description: '',
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const vehicleLabel = form.vehicleId ? vehicles.find((v) => v.id === form.vehicleId)?.registrationNumber : '—';

  return (
    <PageLayout
      title="Fleet Requisitions"
      actions={
        <button type="button" onClick={() => { setShowForm(true); setError(''); }} className="ims-btn-primary">
          Create Requisition
        </button>
      }
    >
      {showForm && (
        <Modal title="Service Requisition" onClose={() => setShowForm(false)} width="max-w-3xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber="—"
              status="Draft"
              createdBy={currentUser?.name ?? '—'}
              department={currentUser?.department?.name ?? '—'}
              date={form.requestDate ? new Date(form.requestDate).toLocaleDateString() : new Date().toLocaleDateString()}
              referenceCode={vehicleLabel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="fleet-req-request" title="Section A – Request details" defaultOpen={true}>
                  <FormField label="Project / Unit" required>
                    <input type="text" required value={form.projectUnit} onChange={(e) => setForm((f) => ({ ...f, projectUnit: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Head of department" required>
                    <input type="text" required value={form.headOfDepartment} onChange={(e) => setForm((f) => ({ ...f, headOfDepartment: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Service requesting officer" required>
                    <input type="text" required value={form.serviceRequestingOfficer} onChange={(e) => setForm((f) => ({ ...f, serviceRequestingOfficer: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Driver name">
                    <input type="text" value={form.driverName} onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Mobile">
                    <input type="text" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Project email">
                    <input type="email" value={form.projectEmail} onChange={(e) => setForm((f) => ({ ...f, projectEmail: e.target.value }))} className="ims-input" />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="fleet-req-vehicle" title="Section B – Vehicle & mileage" defaultOpen={true}>
                  <FormField label="Vehicle" required>
                    <select
                      required
                      value={form.vehicleId}
                      onChange={(e) => {
                        const vId = e.target.value;
                        const v = vehicles.find((x) => x.id === vId);
                        setForm((f) => ({
                          ...f,
                          vehicleId: vId,
                          registrationNumber: v ? v.registrationNumber : '',
                        }));
                      }}
                      className="ims-input"
                    >
                      <option value="">— Select vehicle —</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} – {v.make} {v.model}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Registration number">
                    <input type="text" readOnly value={form.registrationNumber} className="ims-input bg-gov-backgroundAlt" />
                  </FormField>
                  <FormField label="Current mileage">
                    <input type="number" min={0} value={form.currentMileage} onChange={(e) => setForm((f) => ({ ...f, currentMileage: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Last service mileage">
                    <input type="number" min={0} value={form.lastServiceMileage} onChange={(e) => setForm((f) => ({ ...f, lastServiceMileage: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Request date" required>
                    <input type="date" required value={form.requestDate} onChange={(e) => setForm((f) => ({ ...f, requestDate: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Work requested / faults" className="md:col-span-2">
                    <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="ims-input" placeholder="Describe faults and services requested" />
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
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Requested By</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((r) => (
                <tr key={r.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{r.vehicle?.registrationNumber ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.requestedBy?.name ?? '—'}</td>
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
                              .patch(`/api/fleet/requisitions/${r.id}/status`, { status: 'approved' })
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
                              .patch(`/api/fleet/requisitions/${r.id}/status`, { status: 'rejected' })
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
