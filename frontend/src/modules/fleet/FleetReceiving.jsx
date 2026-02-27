import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FleetReceiving() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [requisitions, setRequisitions] = useState([]);
  const [form, setForm] = useState({
    requisitionId: '',
    transportOfficer: '',
    oldNumberPlates: '',
    newNumberPlates: '',
    driverName: '',
    mileage: '',
    battery: false,
    radiator: false,
    engineOil: false,
    brakes: false,
    tyres: false,
    lights: false,
    steering: false,
    clutch: false,
    gearbox: false,
    differential: false,
    propeller: false,
    waterLevel: false,
    remarks: '',
    userSignature: '',
    acceptedBy: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/fleet/receiving').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) api.get('/api/fleet/requisitions').then((res) => setRequisitions(res.data || [])).catch(() => setRequisitions([]));
  }, [showForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.requisitionId) {
      setError('Select a requisition.');
      return;
    }
    const checklist = {
      battery: form.battery,
      radiator: form.radiator,
      engineOil: form.engineOil,
      brakes: form.brakes,
      tyres: form.tyres,
      lights: form.lights,
      steering: form.steering,
      clutch: form.clutch,
      gearbox: form.gearbox,
      differential: form.differential,
      propeller: form.propeller,
      waterLevel: form.waterLevel,
    };
    const payload = {
      requisitionId: form.requisitionId,
      transportOfficer: form.transportOfficer.trim() || undefined,
      oldNumberPlates: form.oldNumberPlates.trim() || undefined,
      newNumberPlates: form.newNumberPlates.trim() || undefined,
      driverName: form.driverName.trim() || undefined,
      mileage: form.mileage !== '' && !Number.isNaN(Number(form.mileage)) ? Number(form.mileage) : undefined,
      checklist,
      remarks: form.remarks.trim() || undefined,
      userSignature: form.userSignature.trim() || undefined,
      acceptedBy: form.acceptedBy.trim() || undefined,
    };
    setSubmitting(true);
    api
      .post('/api/fleet/receiving', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          requisitionId: '',
          transportOfficer: '',
          oldNumberPlates: '',
          newNumberPlates: '',
          driverName: '',
          mileage: '',
          battery: false,
          radiator: false,
          engineOil: false,
          brakes: false,
          tyres: false,
          lights: false,
          steering: false,
          clutch: false,
          gearbox: false,
          differential: false,
          propeller: false,
          waterLevel: false,
          remarks: '',
          userSignature: '',
          acceptedBy: '',
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Receiving</h1>
        <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Record Receipt
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">Vehicle Receiving in Garage</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requisition *</label>
                <select
                  required
                  value={form.requisitionId}
                  onChange={(e) => setForm((f) => ({ ...f, requisitionId: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">— Select —</option>
                  {requisitions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.vehicle?.registrationNumber ?? 'No vehicle'} – {r.requestedBy?.name} ({r.status}) – {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </option>
                  ))}
                </select>
                {requisitions.length === 0 && <p className="text-xs text-gray-500 mt-1">No requisitions.</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport officer</label>
                  <input
                    type="text"
                    value={form.transportOfficer}
                    onChange={(e) => setForm((f) => ({ ...f, transportOfficer: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle registration</label>
                  <input
                    type="text"
                    readOnly
                    value={
                      requisitions.find((r) => r.id === form.requisitionId)?.vehicle?.registrationNumber ??
                      requisitions.find((r) => r.id === form.requisitionId)?.id?.slice(0, 8) ??
                      ''
                    }
                    className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old number plates</label>
                  <input
                    type="text"
                    value={form.oldNumberPlates}
                    onChange={(e) => setForm((f) => ({ ...f, oldNumberPlates: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New number plates</label>
                  <input
                    type="text"
                    value={form.newNumberPlates}
                    onChange={(e) => setForm((f) => ({ ...f, newNumberPlates: e.target.value }))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                  <input
                    type="number"
                    min={0}
                    value={form.mileage}
                    onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Checklist</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  {[
                    ['battery', 'Battery'],
                    ['radiator', 'Radiator'],
                    ['engineOil', 'Engine oil'],
                    ['brakes', 'Brakes'],
                    ['tyres', 'Tyres'],
                    ['lights', 'Lights'],
                    ['steering', 'Steering'],
                    ['clutch', 'Clutch'],
                    ['gearbox', 'Gearbox'],
                    ['differential', 'Differential'],
                    ['propeller', 'Propeller'],
                    ['waterLevel', 'Water level'],
                  ].map(([key, label]) => (
                    <label key={key} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={form.remarks}
                  onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User signature</label>
                  <input
                    type="text"
                    value={form.userSignature}
                    onChange={(e) => setForm((f) => ({ ...f, userSignature: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accepted by</label>
                  <input
                    type="text"
                    value={form.acceptedBy}
                    onChange={(e) => setForm((f) => ({ ...f, acceptedBy: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Saving...' : 'Record'}</button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requisition</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Received By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.requisition?.vehicle?.registrationNumber ?? r.requisition?.id?.slice(0, 8) ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{r.receivedBy?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{r.receivedDate ? new Date(r.receivedDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No receiving records.</p>}
        </div>
      )}
    </div>
  );
}
