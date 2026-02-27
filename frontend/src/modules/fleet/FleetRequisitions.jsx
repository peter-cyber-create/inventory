import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FleetRequisitions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    projectUnit: '',
    headOfDepartment: '',
    serviceRequestingOfficer: '',
    driverName: '',
    mobile: '',
    projectEmail: '',
    vehicleId: '',
    registrationNumber: '',
    currentMileage: '',
    lastServiceMileage: '',
    requestDate: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/fleet/requisitions').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api
        .get('/api/fleet/vehicles')
        .then((res) => setVehicles(res.data || []))
        .catch(() => setVehicles([]));
    }
  }, [showForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectUnit.trim() || !form.headOfDepartment.trim() || !form.serviceRequestingOfficer.trim()) {
      setError('Project/unit, head of department, and requesting officer are required.');
      return;
    }
    if (!form.vehicleId) {
      setError('Select a vehicle.');
      return;
    }
    if (!form.requestDate) {
      setError('Select a request date.');
      return;
    }
    setSubmitting(true);
    const payload = {
      projectUnit: form.projectUnit.trim(),
      headOfDepartment: form.headOfDepartment.trim(),
      serviceRequestingOfficer: form.serviceRequestingOfficer.trim(),
      driverName: form.driverName.trim() || undefined,
      mobile: form.mobile.trim() || undefined,
      projectEmail: form.projectEmail.trim() || undefined,
      vehicleId: form.vehicleId || undefined,
      description: form.description.trim() || undefined,
      currentMileage: form.currentMileage !== '' ? Number(form.currentMileage) : undefined,
      lastServiceMileage: form.lastServiceMileage !== '' ? Number(form.lastServiceMileage) : undefined,
      requestDate: form.requestDate || undefined,
    };
    api
      .post('/api/fleet/requisitions', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          projectUnit: '',
          headOfDepartment: '',
          serviceRequestingOfficer: '',
          driverName: '',
          mobile: '',
          projectEmail: '',
          vehicleId: '',
          registrationNumber: '',
          currentMileage: '',
          lastServiceMileage: '',
          requestDate: '',
          description: '',
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Fleet Requisitions</h1>
        <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Create Requisition
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">Service Requisition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project / Unit *</label>
                  <input
                    type="text"
                    value={form.projectUnit}
                    onChange={(e) => setForm((f) => ({ ...f, projectUnit: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head of department *</label>
                  <input
                    type="text"
                    value={form.headOfDepartment}
                    onChange={(e) => setForm((f) => ({ ...f, headOfDepartment: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service requesting officer *</label>
                  <input
                    type="text"
                    value={form.serviceRequestingOfficer}
                    onChange={(e) => setForm((f) => ({ ...f, serviceRequestingOfficer: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver name</label>
                  <input
                    type="text"
                    value={form.driverName}
                    onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project / unit email</label>
                  <input
                    type="email"
                    value={form.projectEmail}
                    onChange={(e) => setForm((f) => ({ ...f, projectEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
                  <select
                    value={form.vehicleId}
                    onChange={(e) => {
                      const vId = e.target.value;
                      const v = vehicles.find((x) => x.id === vId);
                      setForm((f) => ({
                        ...f,
                        vehicleId: vId,
                        registrationNumber: v ? v.registrationNumber : '',
                      }));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select vehicle —</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} – {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration number</label>
                  <input
                    type="text"
                    readOnly
                    value={form.registrationNumber}
                    className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current mileage</label>
                  <input
                    type="number"
                    min={0}
                    value={form.currentMileage}
                    onChange={(e) => setForm((f) => ({ ...f, currentMileage: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last service mileage</label>
                  <input
                    type="number"
                    min={0}
                    value={form.lastServiceMileage}
                    onChange={(e) => setForm((f) => ({ ...f, lastServiceMileage: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request date *</label>
                  <input
                    type="date"
                    value={form.requestDate}
                    onChange={(e) => setForm((f) => ({ ...f, requestDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work requested / faults</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Describe faults and services requested"
                />
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requested By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.vehicle?.registrationNumber ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{r.requestedBy?.name ?? '-'}</td>
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
