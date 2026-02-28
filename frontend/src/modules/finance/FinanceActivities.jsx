import { useState, useEffect } from 'react';
import api from '../../services/api';

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
    if (showForm) api.get('/api/admin/departments').then((res) => setDepartments(res.data || [])).catch(() => setDepartments([]));
  }, [showForm]);

  const openCreate = () => {
    setEditing(null);
    setForm({
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

    const then = () => { setShowForm(false); setEditing(null); load(page, search); };
    const req = editing
      ? api.patch(`/api/finance/activities/${editing.id}`, payload)
      : api.post('/api/finance/activities', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Finance Activities</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
          <input type="text" placeholder="Search by title" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
          <button type="submit" className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Search</button>
        </form>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Activity
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Activity' : 'New Finance Activity'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice date</label>
                  <input
                    type="date"
                    value={form.invoiceDate}
                    onChange={(e) => setForm((f) => ({ ...f, invoiceDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher number</label>
                  <input
                    type="text"
                    value={form.voucherNumber}
                    onChange={(e) => setForm((f) => ({ ...f, voucherNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funder</label>
                  <input
                    type="text"
                    value={form.funder}
                    onChange={(e) => setForm((f) => ({ ...f, funder: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <input
                    type="number"
                    min={0}
                    value={form.days}
                    onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                  <input type="text" value={form.activityType} onChange={(e) => setForm((f) => ({ ...f, activityType: e.target.value }))} placeholder="e.g. budget, expenditure" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    <option value="planned">Planned</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">— None —</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Participants</label>
                  <button
                    type="button"
                    onClick={() =>
                      setParticipants((prev) => [...prev, { name: '', title: '', phone: '', amount: '', days: '' }])
                    }
                    className="text-sm text-gov-blue"
                  >
                    + Add participant
                  </button>
                </div>
                {participants.length === 0 ? (
                  <p className="text-xs text-gray-500">No participants added.</p>
                ) : (
                  <div className="space-y-2">
                    {participants.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Name"
                          value={p.name}
                          onChange={(e) =>
                            setParticipants((prev) =>
                              prev.map((row, i) => (i === idx ? { ...row, name: e.target.value } : row)),
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={p.title}
                          onChange={(e) =>
                            setParticipants((prev) =>
                              prev.map((row, i) => (i === idx ? { ...row, title: e.target.value } : row)),
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={p.phone}
                          onChange={(e) =>
                            setParticipants((prev) =>
                              prev.map((row, i) => (i === idx ? { ...row, phone: e.target.value } : row)),
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={p.amount}
                          onChange={(e) =>
                            setParticipants((prev) =>
                              prev.map((row, i) => (i === idx ? { ...row, amount: e.target.value } : row)),
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="Days"
                            value={p.days}
                            onChange={(e) =>
                              setParticipants((prev) =>
                                prev.map((row, i) => (i === idx ? { ...row, days: e.target.value } : row)),
                              )
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setParticipants((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Invoice Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 text-sm">{a.title}</td>
                  <td className="px-4 py-2 text-sm">{Number(a.amount)}</td>
                  <td className="px-4 py-2 text-sm">{a.activityType ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{a.status ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{a.department?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    {a.invoiceDate ? new Date(a.invoiceDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(a)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(a)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No activities.</p>}
          {total > limit && (
            <div className="px-4 py-2 border-t border-gray-200 flex justify-between text-sm">
              <span className="text-gray-600">{list.length} of {total}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                <span className="py-1">Page {page}</span>
                <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
