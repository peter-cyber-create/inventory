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

export default function FinanceActivities() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    activityType: '',
    departmentId: '',
    invoiceDate: '',
    voucherNumber: '',
    funder: '',
    status: '',
    days: '',
  });
  const [participants, setParticipants] = useState([]);
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
    api.get('/api/finance/activities', { params })
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
    if (showForm) {
      api.get('/api/admin/departments').then((res) => {
        const raw = res.data;
        setDepartments(Array.isArray(raw) ? raw : (raw?.data ?? []));
      }).catch(() => setDepartments([]));
    }
  }, [showForm]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '', description: '', amount: '', activityType: '', departmentId: '',
      invoiceDate: '', voucherNumber: '', funder: '', status: '', days: '',
    });
    setParticipants([]);
    setShowForm(true);
    setError('');
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title ?? '',
      description: a.description ?? '',
      amount: a.amount != null ? Number(a.amount) : '',
      activityType: a.activityType ?? '',
      departmentId: a.departmentId ?? '',
      invoiceDate: a.invoiceDate ? a.invoiceDate.slice(0, 10) : '',
      voucherNumber: a.voucherNumber ?? '',
      funder: a.funder ?? '',
      status: a.status ?? '',
      days: a.days != null ? String(a.days) : '',
    });
    setParticipants(
      Array.isArray(a.participants)
        ? a.participants.map((p) => ({
            name: p.name ?? '',
            title: p.title ?? '',
            phone: p.phone ?? '',
            amount: p.amount != null ? String(p.amount) : '',
            days: p.days != null ? String(p.days) : '',
          }))
        : [],
    );
    setShowForm(true);
    setError('');
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (a) => {
    if (!window.confirm(`Delete activity "${a.title}"?`)) return;
    setError('');
    api.delete(`/api/finance/activities/${a.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const amountNum = Number(form.amount);
    if (form.title.trim() === '') {
      setError('Title is required.');
      return;
    }
    if (Number.isNaN(amountNum)) {
      setError('Enter a valid amount.');
      return;
    }
    setSubmitting(true);
    const payload = { title: form.title.trim(), amount: amountNum };
    if (form.description?.trim()) payload.description = form.description.trim();
    if (form.activityType?.trim()) payload.activityType = form.activityType.trim();
    if (form.departmentId) payload.departmentId = form.departmentId;
    else if (editing) payload.departmentId = null;
    if (form.invoiceDate) payload.invoiceDate = form.invoiceDate;
    if (form.voucherNumber.trim()) payload.voucherNumber = form.voucherNumber.trim();
    if (form.funder.trim()) payload.funder = form.funder.trim();
    if (form.status.trim()) payload.status = form.status.trim();
    if (form.days !== '' && !Number.isNaN(Number(form.days))) payload.days = Number(form.days);
    const cleanParticipants = participants
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        title: p.title.trim() || undefined,
        phone: p.phone.trim() || undefined,
        amount: p.amount !== '' && !Number.isNaN(Number(p.amount)) ? Number(p.amount) : undefined,
        days: p.days !== '' && !Number.isNaN(Number(p.days)) ? Number(p.days) : undefined,
      }));
    if (cleanParticipants.length) payload.participants = cleanParticipants;

    const then = () => { closeForm(); load(page, search); };
    const req = editing
      ? api.patch(`/api/finance/activities/${editing.id}`, payload)
      : api.post('/api/finance/activities', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  const docNumber = editing?.voucherNumber || form.voucherNumber || '—';
  const docStatus = form.status || editing?.status || 'Draft';
  const deptName = departments.find((d) => d.id === form.departmentId)?.name ?? editing?.department?.name ?? '—';

  return (
    <PageLayout
      title="Finance Activities"
      actions={
        <>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
            <input type="text" placeholder="Search by title" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="ims-input w-48" />
            <button type="submit" className="ims-btn-secondary">Search</button>
          </form>
          <button type="button" onClick={openCreate} className="ims-btn-primary">Add Activity</button>
        </>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {showForm && (
        <Modal title={editing ? 'Edit Activity' : 'New Finance Activity'} onClose={closeForm} width="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber={docNumber}
              status={docStatus}
              createdBy={editing?.createdBy ?? currentUser?.name ?? '—'}
              department={deptName}
              date={editing?.createdAt ? new Date(editing.createdAt).toLocaleDateString() : (form.invoiceDate || new Date().toISOString().slice(0, 10))}
              referenceCode={editing?.id ? editing.id.slice(0, 8) : '—'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="fin-activity" title="Section A – Activity details" defaultOpen={true}>
                  <FormField label="Title" required>
                    <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Description" className="md:col-span-2">
                    <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="ims-input" />
                  </FormField>
                  <FormField label="Amount" required>
                    <input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Activity type">
                    <input type="text" value={form.activityType} onChange={(e) => setForm((f) => ({ ...f, activityType: e.target.value }))} placeholder="e.g. budget, expenditure" className="ims-input" />
                  </FormField>
                  <FormField label="Status">
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="ims-input">
                      <option value="">— Select —</option>
                      <option value="planned">Planned</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </FormField>
                  <FormField label="Department">
                    <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="ims-input">
                      <option value="">— None —</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="fin-financial" title="Section B – Financial" defaultOpen={true}>
                  <FormField label="Invoice date">
                    <input type="date" value={form.invoiceDate} onChange={(e) => setForm((f) => ({ ...f, invoiceDate: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Voucher number">
                    <input type="text" value={form.voucherNumber} onChange={(e) => setForm((f) => ({ ...f, voucherNumber: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Funder">
                    <input type="text" value={form.funder} onChange={(e) => setForm((f) => ({ ...f, funder: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Days">
                    <input type="number" min={0} value={form.days} onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))} className="ims-input" />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="fin-participants" title="Section C – Participants" defaultOpen={false}>
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-label text-gov-secondary">Participants</span>
                      <button
                        type="button"
                        onClick={() => setParticipants((prev) => [...prev, { name: '', title: '', phone: '', amount: '', days: '' }])}
                        className="text-body-sm text-gov-accent hover:underline font-medium"
                      >
                        + Add participant
                      </button>
                    </div>
                    {participants.length === 0 ? (
                      <p className="text-body-sm text-gov-secondaryMuted">No participants added.</p>
                    ) : (
                      <div className="space-y-2">
                        {participants.map((p, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                            <input type="text" placeholder="Name" value={p.name} onChange={(e) => setParticipants((prev) => prev.map((row, i) => (i === idx ? { ...row, name: e.target.value } : row)))} className="ims-input py-1.5 text-body-sm" />
                            <input type="text" placeholder="Title" value={p.title} onChange={(e) => setParticipants((prev) => prev.map((row, i) => (i === idx ? { ...row, title: e.target.value } : row)))} className="ims-input py-1.5 text-body-sm" />
                            <input type="text" placeholder="Phone" value={p.phone} onChange={(e) => setParticipants((prev) => prev.map((row, i) => (i === idx ? { ...row, phone: e.target.value } : row)))} className="ims-input py-1.5 text-body-sm" />
                            <input type="number" placeholder="Amount" value={p.amount} onChange={(e) => setParticipants((prev) => prev.map((row, i) => (i === idx ? { ...row, amount: e.target.value } : row)))} className="ims-input py-1.5 text-body-sm" />
                            <div className="flex items-center gap-1">
                              <input type="number" placeholder="Days" value={p.days} onChange={(e) => setParticipants((prev) => prev.map((row, i) => (i === idx ? { ...row, days: e.target.value } : row)))} className="ims-input py-1.5 text-body-sm w-20" />
                              <button type="button" onClick={() => setParticipants((prev) => prev.filter((_, i) => i !== idx))} className="text-gov-danger hover:underline text-body-sm">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormSectionCollapsible>

                <FormActions className="mt-4">
                  <button type="button" onClick={closeForm} className="ims-btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
                </FormActions>
              </div>
              <div>
                <AuditTrailPanel createdBy={editing?.createdBy ?? currentUser?.name} createdAt={editing?.createdAt} modifiedAt={editing?.updatedAt} />
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
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Invoice Date</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((a) => (
                <tr key={a.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{a.title}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{Number(a.amount)}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{a.activityType ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{a.status ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{a.department?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{a.invoiceDate ? new Date(a.invoiceDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    <button type="button" onClick={() => openEdit(a)} className="text-gov-accent hover:underline text-body-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(a)} className="text-gov-danger hover:underline text-body-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">No activities.</p>}
          {total > limit && (
            <div className="px-4 py-3 border-t border-gov-borderLight flex justify-between items-center text-body-sm text-gov-secondary">
              <span>{list.length} of {total}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Prev</button>
                <span className="py-1">Page {page}</span>
                <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
