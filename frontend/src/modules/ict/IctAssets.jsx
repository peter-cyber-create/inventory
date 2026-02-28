import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUS_OPTIONS = ['available', 'assigned', 'maintenance'];

export default function IctAssets() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    assetTag: '', name: '', category: '', serialNumber: '', status: 'available',
    location: '', assignedToId: '', purchaseDate: '',
  });
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
    setForm({ assetTag: '', name: '', category: '', serialNumber: '', status: 'available', location: '', assignedToId: '', purchaseDate: '' });
    setShowForm(true);
    setError('');
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      assetTag: a.assetTag,
      name: a.name,
      category: a.category,
      serialNumber: a.serialNumber ?? '',
      status: a.status ?? 'available',
      location: a.location ?? '',
      assignedToId: a.assignedToId ?? '',
      purchaseDate: a.purchaseDate ? new Date(a.purchaseDate).toISOString().slice(0, 10) : '',
    });
    setShowForm(true);
    setError('');
  };

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

    const then = () => { setShowForm(false); setEditing(null); load(page, search); };
    const req = editing
      ? api.patch(`/api/ict/assets/${editing.id}`, payload)
      : api.post('/api/ict/assets', payload);
    req
      .then(then)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">ICT Assets Inventory</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
          <input type="text" placeholder="Search tag, name, serial" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
          <button type="submit" className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Search</button>
        </form>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Asset
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Asset' : 'New ICT Asset'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                <input type="text" required value={form.assetTag} onChange={(e) => setForm((f) => ({ ...f, assetTag: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <input type="text" value={form.serialNumber} onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select value={form.assignedToId} onChange={(e) => setForm((f) => ({ ...f, assignedToId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">— None —</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Asset Tag</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Assigned To</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-2 text-sm">{a.assetTag}</td>
                  <td className="px-4 py-2 text-sm">{a.name}</td>
                  <td className="px-4 py-2 text-sm">{a.category}</td>
                  <td className="px-4 py-2 text-sm">{a.status}</td>
                  <td className="px-4 py-2 text-sm">{a.location ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{a.assignedTo?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(a)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(a)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No assets recorded.</p>}
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
