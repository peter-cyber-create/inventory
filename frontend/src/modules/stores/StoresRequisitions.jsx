import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StoresRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    departmentId: '',
    serialNumber: '',
    country: 'The Republic of Uganda',
    ministry: 'Ministry of Health',
    fromDepartment: '',
    toStore: '',
    purpose: '',
    lines: [{ itemId: '', quantityRequested: 1 }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/stores/requisitions').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/admin/departments').then((res) => setDepartments(res.data)).catch(() => setDepartments([]));
      api.get('/api/stores/items').then((res) => setItems(res.data)).catch(() => setItems([]));
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Store Requisitions (Form 76A)</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Create Requisition
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">New Requisition (Form 76A)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial no.</label>
                  <input
                    type="text"
                    value={form.serialNumber}
                    onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministry</label>
                  <input
                    type="text"
                    value={form.ministry}
                    onChange={(e) => setForm((f) => ({ ...f, ministry: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From department</label>
                  <input
                    type="text"
                    value={form.fromDepartment}
                    onChange={(e) => setForm((f) => ({ ...f, fromDepartment: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To store</label>
                  <input
                    type="text"
                    value={form.toStore}
                    onChange={(e) => setForm((f) => ({ ...f, toStore: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={form.departmentId}
                    onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / remarks</label>
                  <input
                    type="text"
                    value={form.purpose}
                    onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Line items</label>
                  <button type="button" onClick={addLine} className="text-sm text-gov-blue">+ Add line</button>
                </div>
                <div className="space-y-2">
                  {form.lines.map((line, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select
                        required
                        value={line.itemId}
                        onChange={(e) => updateLine(idx, 'itemId', e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select item</option>
                        {items.map((it) => (
                          <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={line.quantityRequested}
                        onChange={(e) => updateLine(idx, 'quantityRequested', e.target.value ? parseInt(e.target.value, 10) : 0)}
                        className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeLine(idx)} className="text-red-600 text-sm">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Submit'}
                </button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requester</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.requester?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{r.department?.name ?? '-'}</td>
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
