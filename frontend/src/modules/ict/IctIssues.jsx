import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function IctIssues() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [requisitions, setRequisitions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ requisitionId: '', assetId: '', issuedToId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/ict/issues').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/ict/requisitions').then((res) => {
        const pending = (res.data || []).filter((r) => (r.status || '').toLowerCase() === 'pending');
        setRequisitions(pending);
      }).catch(() => setRequisitions([]));
      api.get('/api/ict/assets').then((res) => {
        const available = (res.data || []).filter((a) => (a.status || '').toLowerCase() === 'available');
        setAssets(available);
      }).catch(() => setAssets([]));
      api.get('/api/admin/users').then((res) => setUsers(res.data || [])).catch(() => setUsers([]));
    }
  }, [showForm]);

  const selectedRequisition = requisitions.find((r) => r.id === form.requisitionId);
  const assetTypeMatch = selectedRequisition?.assetType
    ? assets.filter((a) => a.category?.toLowerCase() === selectedRequisition.assetType?.toLowerCase())
    : assets;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.requisitionId || !form.assetId || !form.issuedToId) {
      setError('Select requisition, asset, and issue to.');
      return;
    }
    setSubmitting(true);
    api
      .post('/api/ict/issues', { requisitionId: form.requisitionId, assetId: form.assetId, issuedToId: form.issuedToId })
      .then(() => {
        setShowForm(false);
        setForm({ requisitionId: '', assetId: '', issuedToId: '' });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">ICT Issue Management</h1>
        <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Issue Asset
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">Issue Asset from Requisition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requisition (pending) *</label>
                <select required value={form.requisitionId} onChange={(e) => setForm((f) => ({ ...f, requisitionId: e.target.value, assetId: '' }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">— Select —</option>
                  {requisitions.map((r) => (
                    <option key={r.id} value={r.id}>{r.assetType} × {r.quantity} – {r.requester?.name} ({r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''})</option>
                  ))}
                </select>
                {requisitions.length === 0 && <p className="text-xs text-gray-500 mt-1">No pending requisitions.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset (available) *</label>
                <select required value={form.assetId} onChange={(e) => setForm((f) => ({ ...f, assetId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">— Select —</option>
                  {assetTypeMatch.map((a) => (
                    <option key={a.id} value={a.id}>{a.assetTag} – {a.name} ({a.category})</option>
                  ))}
                </select>
                {selectedRequisition && assetTypeMatch.length === 0 && <p className="text-xs text-gray-500 mt-1">No available assets in category &quot;{selectedRequisition.assetType}&quot;.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue To *</label>
                <select required value={form.issuedToId} onChange={(e) => setForm((f) => ({ ...f, issuedToId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">— Select user —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Issuing...' : 'Issue'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Asset</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Issued To</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2 text-sm">{i.asset?.assetTag ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.issuedTo?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.issueDate ? new Date(i.issueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No issues recorded.</p>}
        </div>
      )}
    </div>
  );
}
