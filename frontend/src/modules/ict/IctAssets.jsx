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

  const load = () => {
    api.get('/api/ict/assets').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm || editing) {
      api.get('/api/admin/users').then((res) => setUsers(res.data || [])).catch(() => setUsers([]));
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
    api.delete(`/api/ict/assets/${a.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
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

    const then = () => { setShowForm(false); setEditing(null); load(); };
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">ICT Assets Inventory</h1>
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
        </div>
      )}
    </div>
  );
}
