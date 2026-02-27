import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FleetSpareParts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    partNumber: '',
    quantity: 0,
    location: '',
    category: '',
    brand: '',
    unitPrice: '',
    unitOfMeasure: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/fleet/spare-parts').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      partNumber: '',
      quantity: 0,
      location: '',
      category: '',
      brand: '',
      unitPrice: '',
      unitOfMeasure: '',
    });
    setShowForm(true);
    setError('');
  };
  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name,
      partNumber: s.partNumber,
      quantity: s.quantity ?? 0,
      location: s.location ?? '',
      category: s.category ?? '',
      brand: s.brand ?? '',
      unitPrice: s.unitPrice != null ? String(s.unitPrice) : '',
      unitOfMeasure: s.unitOfMeasure ?? '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (s) => {
    if (!window.confirm(`Delete spare part "${s.name}" (${s.partNumber})?`)) return;
    api.delete(`/api/fleet/spare-parts/${s.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      partNumber: form.partNumber.trim(),
      quantity: Number(form.quantity) || 0,
    };
    if (form.location.trim()) payload.location = form.location.trim();
    else if (editing) payload.location = null;
    if (form.category.trim()) payload.category = form.category.trim();
    if (form.brand.trim()) payload.brand = form.brand.trim();
    if (form.unitPrice !== '' && !Number.isNaN(Number(form.unitPrice))) payload.unitPrice = Number(form.unitPrice);
    if (form.unitOfMeasure.trim()) payload.unitOfMeasure = form.unitOfMeasure.trim();

    const then = () => { setShowForm(false); setEditing(null); load(); };
    const req = editing ? api.patch(`/api/fleet/spare-parts/${editing.id}`, payload) : api.post('/api/fleet/spare-parts', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Spare Parts</h1>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Spare Part
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Spare Part' : 'New Spare Part'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number *</label>
                <input type="text" required value={form.partNumber} onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    <option value="Bosch">Bosch</option>
                    <option value="Denso">Denso</option>
                    <option value="NGK">NGK</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" min={0} value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value, 10) || 0 }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.unitPrice}
                    onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit of measure</label>
                  <select
                    value={form.unitOfMeasure}
                    onChange={(e) => setForm((f) => ({ ...f, unitOfMeasure: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    <option value="Litres">Litres</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Units">Units</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Part Number</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Brand</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Unit price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-sm">{s.partNumber}</td>
                  <td className="px-4 py-2 text-sm">{s.name}</td>
                    <td className="px-4 py-2 text-sm">{s.category ?? '-'}</td>
                    <td className="px-4 py-2 text-sm">{s.brand ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{s.quantity}</td>
                    <td className="px-4 py-2 text-sm">{s.unitOfMeasure ?? '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      {s.unitPrice != null
                        ? Number(s.unitPrice).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : '-'}
                    </td>
                  <td className="px-4 py-2 text-sm">{s.location ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(s)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(s)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No spare parts.</p>}
        </div>
      )}
    </div>
  );
}
