import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import FormSectionCollapsible from '../../components/ui/FormSectionCollapsible';
import FormField from '../../components/ui/FormField';
import LineItemGrid from '../../components/ui/LineItemGrid';
import FormActions from '../../components/ui/FormActions';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

export default function StoresRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    departmentId: '',
    serialNumber: '',
    date: new Date().toISOString().slice(0, 10),
    country: 'The Republic of Uganda',
    ministry: 'Ministry of Health',
    fromDepartment: '',
    toStore: '',
    purpose: '',
    lines: [{ itemId: '', quantityRequested: 1 }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getUser();

  const load = () => {
    api.get('/api/stores/requisitions').then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/admin/departments').then((res) => setDepartments(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setDepartments([]));
      api.get('/api/stores/items', { params: { limit: 500 } }).then((res) => {
        const d = res.data?.data ?? res.data;
        setItems(Array.isArray(d) ? d : []);
      }).catch(() => setItems([]));
    }
  }, [showForm]);

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { itemId: '', quantityRequested: 1 }] }));
  const removeLine = (idx) => setForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));
  const updateLine = (idx, field, value) => setForm((f) => ({
    ...f,
    lines: f.lines.map((l, i) => i === idx ? { ...l, [field]: value } : l),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      items: form.lines
        .filter((l) => l.itemId && l.quantityRequested >= 1)
        .map((l) => ({ itemId: l.itemId, quantityRequested: Number(l.quantityRequested) })),
    };
    if (form.departmentId) payload.departmentId = form.departmentId;
    if (form.serialNumber.trim()) payload.serialNumber = form.serialNumber.trim();
    if (form.country.trim()) payload.country = form.country.trim();
    if (form.ministry.trim()) payload.ministry = form.ministry.trim();
    if (form.fromDepartment.trim()) payload.fromDepartment = form.fromDepartment.trim();
    if (form.toStore.trim()) payload.toStore = form.toStore.trim();
    if (form.purpose.trim()) payload.purpose = form.purpose.trim();
    if (payload.items.length === 0) {
      setError('Add at least one item with quantity.');
      return;
    }
    setSubmitting(true);
    api
      .post('/api/stores/requisitions', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          departmentId: '',
          serialNumber: '',
          date: new Date().toISOString().slice(0, 10),
          country: 'The Republic of Uganda',
          ministry: 'Ministry of Health',
          fromDepartment: '',
          toStore: '',
          purpose: '',
          lines: [{ itemId: '', quantityRequested: 1 }],
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const getAvailableStock = (line, item) => (item != null ? (item.quantityInStock ?? item.quantity ?? null) : null);

  return (
    <PageLayout
      title="Store Requisitions (Form 76A)"
      actions={
        <button type="button" onClick={() => { setShowForm(true); setError(''); }} className="ims-btn-primary">
          Create Requisition
        </button>
      }
    >
      {showForm && (
        <Modal title="New Requisition (Form 76A)" onClose={() => setShowForm(false)} width="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber={form.serialNumber || '—'}
              status="Draft"
              createdBy={currentUser?.name ?? '—'}
              department={currentUser?.department?.name ?? (departments.find((d) => d.id === form.departmentId)?.name ?? '—')}
              date={form.date ? new Date(form.date).toLocaleDateString() : new Date().toLocaleDateString()}
              referenceCode={form.ministry || '—'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="req-header" title="Section A – Requisition header" defaultOpen={true}>
                  <FormField label="Serial no.">
                    <input type="text" value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Date">
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Country">
                    <input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Ministry">
                    <input type="text" value={form.ministry} onChange={(e) => setForm((f) => ({ ...f, ministry: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="From department">
                    <input type="text" value={form.fromDepartment} onChange={(e) => setForm((f) => ({ ...f, fromDepartment: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="To store">
                    <input type="text" value={form.toStore} onChange={(e) => setForm((f) => ({ ...f, toStore: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Department">
                    <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="ims-input">
                      <option value="">— Select —</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Purpose / remarks">
                    <input type="text" value={form.purpose} onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))} className="ims-input" />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="req-lines" title="Section B – Line items" defaultOpen={true}>
                  <div className="md:col-span-2">
                    <LineItemGrid
                      lines={form.lines}
                      onAddLine={addLine}
                      onRemoveLine={removeLine}
                      onUpdateLine={updateLine}
                      itemOptions={items}
                      getItemLabel={(item) => item ? `${item.name}${item.unit ? ` (${item.unit})` : ''}` : '—'}
                      getAvailableStock={getAvailableStock}
                      showUnit={false}
                      showAvailableStock={true}
                      showUnitCost={false}
                      showTotal={false}
                      quantityKey="quantityRequested"
                      itemIdKey="itemId"
                      unitPriceKey="unitPrice"
                      minQuantity={1}
                      emptyMessage="Add at least one item. Click '+ Add line'."
                    />
                  </div>
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

      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-hidden">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Requester</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((r) => (
                <tr key={r.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{r.requester?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.department?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.status}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
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
