import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StoresItems() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'pcs',
    brand: '',
    barcode: '',
    isAssetSource: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/stores/items').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = (i) => {
    if (!window.confirm(`Delete item "${i.name}"? Stock and related records may be affected.`)) return;
    setError('');
    api.delete(`/api/stores/items/${i.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { name: form.name, unit: form.unit, isAssetSource: form.isAssetSource };
    if (form.sku.trim()) payload.sku = form.sku.trim();
    if (form.category.trim()) payload.category = form.category.trim();
    if (form.brand.trim()) payload.brand = form.brand.trim();
    if (form.barcode.trim()) payload.barcode = form.barcode.trim();
    api
      .post('/api/stores/items', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          name: '',
          sku: '',
          category: '',
          unit: 'pcs',
          brand: '',
          barcode: '',
          isAssetSource: false,
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Store Items</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Add Item
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
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
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={form.barcode}
                    onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="asset"
                  checked={form.isAssetSource}
                  onChange={(e) => setForm((f) => ({ ...f, isAssetSource: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="asset" className="text-sm text-gray-700">Can be converted to asset</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm">
                  Cancel
                </button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">SKU</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Brand</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Barcode</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Qty in Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2 text-sm">{i.name}</td>
                  <td className="px-4 py-2 text-sm">{i.sku ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.category ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.brand ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.unit}</td>
                  <td className="px-4 py-2 text-sm">{i.barcode ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.quantityInStock}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => handleDelete(i)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No items.</p>}
        </div>
      )}
    </div>
  );
}
