import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function IctRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetType: '', quantity: 1, justification: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/ict/requisitions').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { assetType: form.assetType.trim(), quantity: Number(form.quantity) || 1 };
    if (form.justification.trim()) payload.justification = form.justification.trim();
    api
      .post('/api/ict/requisitions', payload)
      .then(() => {
        setShowForm(false);
        setForm({ assetType: '', quantity: 1, justification: '' });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">ICT Requisitions</h1>
        <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Create Requisition
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">New ICT Requisition</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
                <input type="text" required value={form.assetType} onChange={(e) => setForm((f) => ({ ...f, assetType: e.target.value }))} placeholder="e.g. Laptop, Monitor" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value, 10) || 1 }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                <textarea value={form.justification} onChange={(e) => setForm((f) => ({ ...f, justification: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Saving...' : 'Submit'}</button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Asset Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requester</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.assetType}</td>
                  <td className="px-4 py-2 text-sm">{r.quantity}</td>
                  <td className="px-4 py-2 text-sm">{r.requester?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{r.status}</td>
                  <td className="px-4 py-2 text-sm">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No requisitions.</p>}
        </div>
      )}
    </div>
  );
}
