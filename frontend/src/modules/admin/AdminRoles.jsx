import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminRoles() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/admin/roles').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '' });
    setShowForm(true);
    setError('');
  };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name ?? '' });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (r) => {
    if (!window.confirm(`Delete role "${r.name}"? Users with this role will have no role.`)) return;
    setError('');
    api.delete(`/api/admin/roles/${r.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSubmitting(true);
    const payload = { name: form.name.trim() };
    const then = () => { setShowForm(false); setEditing(null); load(); };
    const req = editing ? api.patch(`/api/admin/roles/${editing.id}`, payload) : api.post('/api/admin/roles', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Roles & Permissions</h1>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Role
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Role' : 'New Role'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Users</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.name}</td>
                  <td className="px-4 py-2 text-sm">{r._count?.users ?? 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(r)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(r)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No roles.</p>}
        </div>
      )}
    </div>
  );
}
