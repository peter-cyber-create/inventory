import { useState, useEffect } from 'react';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import FormSection from '../../components/ui/FormSection';
import FormField from '../../components/ui/FormField';
import FormActions from '../../components/ui/FormActions';

const INITIAL_FORM = {
  registrationNumber: '', make: '', model: '', year: '', status: 'active', assignedDriver: '',
  oldNumberPlate: '', newNumberPlate: '', type: '', chassisNumber: '', engineNumber: '',
  fuel: '', power: '', totalCost: '', countryOfOrigin: '', color: '', userDepartment: '', officer: '', contact: '',
};

export default function FleetVehicles() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = (p = page, q = search) => {
    setLoading(true);
    const params = { page: p, limit };
    if (q) params.search = q;
    api.get('/api/fleet/vehicles', { params })
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
  const openEdit = (v) => {
    setEditing(v);
    setForm({
      registrationNumber: v.registrationNumber,
      make: v.make,
      model: v.model,
      year: v.year ?? '',
      status: v.status ?? 'active',
      assignedDriver: v.assignedDriver ?? '',
      oldNumberPlate: v.oldNumberPlate ?? '',
      newNumberPlate: v.newNumberPlate ?? '',
      type: v.type ?? '',
      chassisNumber: v.chassisNumber ?? '',
      engineNumber: v.engineNumber ?? '',
      fuel: v.fuel ?? '',
      power: v.power != null ? String(v.power) : '',
      totalCost: v.totalCost != null ? String(v.totalCost) : '',
      countryOfOrigin: v.countryOfOrigin ?? '',
      color: v.color ?? '',
      userDepartment: v.userDepartment ?? '',
      officer: v.officer ?? '',
      contact: v.contact ?? '',
    });
    setShowForm(true);
    setError('');
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (v) => {
    if (!window.confirm(`Delete vehicle "${v.registrationNumber}"?`)) return;
    api.delete(`/api/fleet/vehicles/${v.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      registrationNumber: form.registrationNumber.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      status: form.status,
    };
    if (form.year !== '' && !Number.isNaN(Number(form.year))) payload.year = Number(form.year);
    if (form.assignedDriver.trim()) payload.assignedDriver = form.assignedDriver.trim();
    else if (editing) payload.assignedDriver = null;
    if (form.oldNumberPlate.trim()) payload.oldNumberPlate = form.oldNumberPlate.trim();
    else if (editing) payload.oldNumberPlate = null;
    if (form.newNumberPlate.trim()) payload.newNumberPlate = form.newNumberPlate.trim();
    else if (editing) payload.newNumberPlate = null;
    if (form.type.trim()) payload.type = form.type.trim();
    if (form.chassisNumber.trim()) payload.chassisNumber = form.chassisNumber.trim();
    else if (editing) payload.chassisNumber = null;
    if (form.engineNumber.trim()) payload.engineNumber = form.engineNumber.trim();
    else if (editing) payload.engineNumber = null;
    if (form.fuel.trim()) payload.fuel = form.fuel.trim();
    else if (editing) payload.fuel = null;
    if (form.power !== '' && !Number.isNaN(Number(form.power))) payload.power = Number(form.power);
    if (form.totalCost !== '' && !Number.isNaN(Number(form.totalCost))) payload.totalCost = Number(form.totalCost);
    if (form.countryOfOrigin.trim()) payload.countryOfOrigin = form.countryOfOrigin.trim();
    else if (editing) payload.countryOfOrigin = null;
    if (form.color.trim()) payload.color = form.color.trim();
    else if (editing) payload.color = null;
    if (form.userDepartment.trim()) payload.userDepartment = form.userDepartment.trim();
    else if (editing) payload.userDepartment = null;
    if (form.officer.trim()) payload.officer = form.officer.trim();
    else if (editing) payload.officer = null;
    if (form.contact.trim()) payload.contact = form.contact.trim();
    else if (editing) payload.contact = null;
    const then = () => { closeForm(); load(page, search); };
    const req = editing ? api.patch(`/api/fleet/vehicles/${editing.id}`, payload) : api.post('/api/fleet/vehicles', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  const columns = [
    { key: 'registrationNumber', label: 'Registration' },
    { key: 'make', label: 'Make / Model', render: (r) => `${r.make} ${r.model}`.trim() },
    { key: 'year', label: 'Year', render: (r) => r.year ?? '—' },
    { key: 'status', label: 'Status' },
    { key: 'assignedDriver', label: 'Driver', render: (r) => r.assignedDriver ?? '—' },
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
      title="Fleet Vehicles"
      actions={
        <>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
            <input type="text" placeholder="Search registration, make, model" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="ims-input w-48" />
            <button type="submit" className="ims-btn-secondary">Search</button>
          </form>
          <button type="button" onClick={openCreate} className="ims-btn-primary">Add Vehicle</button>
        </>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {showForm && (
        <Modal title={editing ? 'Edit Vehicle' : 'New Vehicle'} onClose={closeForm} width="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}
            <FormSection title="General">
              <FormField label="Registration Number" required>
                <input type="text" required value={form.registrationNumber} onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="ims-input">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </FormField>
              <FormField label="Make" required>
                <input type="text" required value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Model" required>
                <input type="text" required value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Year">
                <input type="number" min={1900} max={2100} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Type">
                <input type="text" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="e.g. saloon, truck" className="ims-input" />
              </FormField>
            </FormSection>
            <FormSection title="Identification">
              <FormField label="Old number plate">
                <input type="text" value={form.oldNumberPlate} onChange={(e) => setForm((f) => ({ ...f, oldNumberPlate: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="New number plate">
                <input type="text" value={form.newNumberPlate} onChange={(e) => setForm((f) => ({ ...f, newNumberPlate: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Chassis number">
                <input type="text" value={form.chassisNumber} onChange={(e) => setForm((f) => ({ ...f, chassisNumber: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Engine number">
                <input type="text" value={form.engineNumber} onChange={(e) => setForm((f) => ({ ...f, engineNumber: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Fuel">
                <input type="text" value={form.fuel} onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))} placeholder="e.g. Diesel, Petrol" className="ims-input" />
              </FormField>
              <FormField label="Power (HP)">
                <input type="number" min={0} value={form.power} onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Total cost">
                <input type="number" min={0} step="0.01" value={form.totalCost} onChange={(e) => setForm((f) => ({ ...f, totalCost: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Country of origin">
                <input type="text" value={form.countryOfOrigin} onChange={(e) => setForm((f) => ({ ...f, countryOfOrigin: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Color">
                <input type="text" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="ims-input" />
              </FormField>
            </FormSection>
            <FormSection title="Assignment">
              <FormField label="Assigned Driver">
                <input type="text" value={form.assignedDriver} onChange={(e) => setForm((f) => ({ ...f, assignedDriver: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="User department">
                <input type="text" value={form.userDepartment} onChange={(e) => setForm((f) => ({ ...f, userDepartment: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Officer">
                <input type="text" value={form.officer} onChange={(e) => setForm((f) => ({ ...f, officer: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Contact">
                <input type="text" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} className="ims-input" />
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
        emptyMessage="No vehicles."
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
