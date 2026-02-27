import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminSettings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ settingKey: '', settingValue: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/admin/settings').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ settingKey: '', settingValue: '' });
    setShowForm(true);
    setError('');
  };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ settingKey: s.settingKey, settingValue: s.settingValue ?? '' });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (s) => {
    if (!window.confirm(`Delete setting "${s.settingKey}"?`)) return;
    setError('');
    api.delete(`/api/admin/settings/${s.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    if (editing) {
      api
        .patch(`/api/admin/settings/${editing.id}`, { settingValue: form.settingValue })
        .then(() => { setShowForm(false); setEditing(null); load(); })
        .catch((err) => setError(err.response?.data?.error || err.message))
        .finally(() => setSubmitting(false));
    } else {
      api
        .post('/api/admin/settings', { settingKey: form.settingKey.trim(), settingValue: form.settingValue })
        .then(() => { setShowForm(false); setForm({ settingKey: '', settingValue: '' }); load(); })
        .catch((err) => setError(err.response?.data?.error || err.message))
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">System Settings</h1>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Setting
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Setting' : 'New Setting'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key {editing ? '(read-only)' : '*'}</label>
                <input type="text" required value={form.settingKey} onChange={(e) => setForm((f) => ({ ...f, settingKey: e.target.value }))} readOnly={!!editing} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 read-only:bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input type="text" required value={form.settingValue} onChange={(e) => setForm((f) => ({ ...f, settingValue: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Key</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-sm font-medium">{s.settingKey}</td>
                  <td className="px-4 py-2 text-sm">{s.settingValue}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(s)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(s)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No settings.</p>}
        </div>
      )}
    </div>
  );
}
