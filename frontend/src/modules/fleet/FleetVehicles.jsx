import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FleetVehicles() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: '',
    status: 'active',
    assignedDriver: '',
    oldNumberPlate: '',
    newNumberPlate: '',
    type: '',
    chassisNumber: '',
    engineNumber: '',
    fuel: '',
    power: '',
    totalCost: '',
    countryOfOrigin: '',
    color: '',
    userDepartment: '',
    officer: '',
    contact: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/fleet/vehicles').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      registrationNumber: '',
      make: '',
      model: '',
      year: '',
      status: 'active',
      assignedDriver: '',
      oldNumberPlate: '',
      newNumberPlate: '',
      type: '',
      chassisNumber: '',
      engineNumber: '',
      fuel: '',
      power: '',
      totalCost: '',
      countryOfOrigin: '',
      color: '',
      userDepartment: '',
      officer: '',
      contact: '',
    });
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

  const handleDelete = (v) => {
    if (!window.confirm(`Delete vehicle "${v.registrationNumber}"?`)) return;
    api.delete(`/api/fleet/vehicles/${v.id}`).then(load).catch((err) => setError(err.response?.data?.error || err.message));
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

    const then = () => { setShowForm(false); setEditing(null); load(); };
    const req = editing ? api.patch(`/api/fleet/vehicles/${editing.id}`, payload) : api.post('/api/fleet/vehicles', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Vehicles</h1>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add Vehicle
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit Vehicle' : 'New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                <input type="text" required value={form.registrationNumber} onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old number plate</label>
                  <input
                    type="text"
                    value={form.oldNumberPlate}
                    onChange={(e) => setForm((f) => ({ ...f, oldNumberPlate: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New number plate</label>
                  <input
                    type="text"
                    value={form.newNumberPlate}
                    onChange={(e) => setForm((f) => ({ ...f, newNumberPlate: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                <input type="text" required value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input type="text" required value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  placeholder="e.g. saloon, truck"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chassis number</label>
                  <input
                    type="text"
                    value={form.chassisNumber}
                    onChange={(e) => setForm((f) => ({ ...f, chassisNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine number</label>
                  <input
                    type="text"
                    value={form.engineNumber}
                    onChange={(e) => setForm((f) => ({ ...f, engineNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel</label>
                  <input
                    type="text"
                    value={form.fuel}
                    onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))}
                    placeholder="e.g. Diesel, Petrol"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Power (HP)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.power}
                    onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total cost</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.totalCost}
                    onChange={(e) => setForm((f) => ({ ...f, totalCost: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of origin</label>
                  <input
                    type="text"
                    value={form.countryOfOrigin}
                    onChange={(e) => setForm((f) => ({ ...f, countryOfOrigin: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User department</label>
                  <input
                    type="text"
                    value={form.userDepartment}
                    onChange={(e) => setForm((f) => ({ ...f, userDepartment: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Officer</label>
                  <input
                    type="text"
                    value={form.officer}
                    onChange={(e) => setForm((f) => ({ ...f, officer: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input type="number" min={1900} max={2100} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
                <input type="text" value={form.assignedDriver} onChange={(e) => setForm((f) => ({ ...f, assignedDriver: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Registration</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Make / Model</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Year</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Driver</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-2 text-sm">{v.registrationNumber}</td>
                  <td className="px-4 py-2 text-sm">{v.make} {v.model}</td>
                  <td className="px-4 py-2 text-sm">{v.year ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{v.status}</td>
                  <td className="px-4 py-2 text-sm">{v.assignedDriver ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(v)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(v)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No vehicles.</p>}
        </div>
      )}
    </div>
  );
}
