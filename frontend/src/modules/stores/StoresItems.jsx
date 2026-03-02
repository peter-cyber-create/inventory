import { useState, useEffect } from 'react';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import FormSection from '../../components/ui/FormSection';
import FormField from '../../components/ui/FormField';
import FormActions from '../../components/ui/FormActions';

const INITIAL_FORM = { name: '', category: '', unit: 'pcs', brand: '', barcode: '' };

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
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (i) => {
    if (!window.confirm(`Delete item "${i.name}"? Stock and related records may be affected.`)) return;
    api.delete(`/api/stores/items/${i.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { name: form.name.trim(), unit: form.unit.trim() || 'pcs' };
    if (form.category.trim()) payload.category = form.category.trim();
    if (form.brand.trim()) payload.brand = form.brand.trim();
    if (form.barcode.trim()) payload.barcode = form.barcode.trim();
    if (editing) {
      if (!form.category.trim()) payload.category = null;
      if (!form.brand.trim()) payload.brand = null;
      if (!form.barcode.trim()) payload.barcode = null;
    }
    const then = () => { closeForm(); setForm(INITIAL_FORM); load(page, search); };
    const req = editing ? api.patch(`/api/stores/items/${editing.id}`, payload) : api.post('/api/stores/items', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (r) => r.category ?? '—' },
    { key: 'brand', label: 'Brand', render: (r) => r.brand ?? '—' },
    { key: 'unit', label: 'Unit' },
    { key: 'barcode', label: 'Barcode', render: (r) => r.barcode ?? '—' },
    { key: 'quantityInStock', label: 'Qty in Stock' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <span className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="text-gov-primary hover:underline text-body-sm">Edit</button>
          <button type="button" onClick={() => handleDelete(r)} className="text-gov-danger hover:underline text-body-sm">Delete</button>
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="Store Items"
      actions={
        <>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
            <input type="text" placeholder="Search name or barcode" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="ims-input w-48" />
            <button type="submit" className="ims-btn-secondary">Search</button>
          </form>
          <button type="button" onClick={openCreate} className="ims-btn-primary">Add Item</button>
        </>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {showForm && (
        <Modal title={editing ? 'Edit Item' : 'New Item'} onClose={closeForm}>
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}
            <FormSection title="Item Details">
              <FormField label="Name" required>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Unit">
                <input type="text" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className="ims-input" placeholder="pcs" />
              </FormField>
              <FormField label="Category">
                <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Brand">
                <input type="text" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Barcode">
                <input type="text" value={form.barcode} onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))} className="ims-input" />
              </FormField>
            </FormSection>
            <FormActions>
              <button type="button" onClick={closeForm} className="ims-btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
            </FormActions>
          </form>
        </Modal>
      )}

      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        emptyMessage="No items."
        paginationSlot={
          total > limit ? (
            <div className="flex items-center gap-2 text-body-sm text-gov-secondary">
              <span>{list.length} of {total}</span>
              <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Prev</button>
              <span>Page {page}</span>
              <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Next</button>
            </div>
          ) : null
        }
      />
    </PageLayout>
  );
}
