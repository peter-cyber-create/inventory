import { useState, useEffect } from 'react';
import api from '../../services/api';

const INITIAL_FORM = {
  name: '',
  category: '',
  unit: 'pcs',
  brand: '',
  barcode: '',
};

export default function StoresItems() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const limit = 20;
  const load = (p = page, q = search) => {
    setLoading(true);
    const params = { page: p, limit };
    if (q) params.search = q;
    api.get('/api/stores/items', { params })
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
  const onSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const openCreate = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
    setShowForm(true);
    setError('');
  };

  const openEdit = (i) => {
    setEditing(i);
    setForm({
      name: i.name ?? '',
      category: i.category ?? '',
      unit: i.unit ?? 'pcs',
      brand: i.brand ?? '',
      barcode: i.barcode ?? '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (i) => {
    if (!window.confirm(`Delete item "${i.name}"? Stock and related records may be affected.`)) return;
    setError('');
    api.delete(`/api/stores/items/${i.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      unit: form.unit.trim() || 'pcs',
    };
    if (form.category.trim()) payload.category = form.category.trim();
    if (form.brand.trim()) payload.brand = form.brand.trim();
    if (form.barcode.trim()) payload.barcode = form.barcode.trim();
    if (editing) {
      if (!form.category.trim()) payload.category = null;
      if (!form.brand.trim()) payload.brand = null;
      if (!form.barcode.trim()) payload.barcode = null;
    }

    const then = () => {
      setShowForm(false);
      setEditing(null);
      setForm(INITIAL_FORM);
      load(page, search);
    };
    const req = editing
      ? api.patch(`/api/stores/items/${editing.id}`, payload)
      : api.post('/api/stores/items', payload);
    req
      .then(then)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Store Items</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search name or barcode"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
          />
          <button type="submit" className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Search</button>
        </form>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Add Item
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Item' : 'New Item'}</h2>
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
                    placeholder="pcs"
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
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gray-300 rounded text-sm">
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
                  <td className="px-4 py-2 text-sm">{i.category ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.brand ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.unit}</td>
                  <td className="px-4 py-2 text-sm">{i.barcode ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.quantityInStock}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(i)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(i)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No items.</p>}
          {total > limit && (
            <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-sm">
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
