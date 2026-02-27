import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function IctMaintenance() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    assetId: '',
    issueDescription: '',
    actionTaken: '',
    technician: '',
    maintenanceDate: '',
    nextServiceDate: '',
    cost: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/api/ict/maintenance')
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api
        .get('/api/ict/assets')
        .then((res) => setAssets(res.data || []))
        .catch(() => setAssets([]));
    }
  }, [showForm]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      assetId: '',
      issueDescription: '',
      actionTaken: '',
      technician: '',
      maintenanceDate: '',
      nextServiceDate: '',
      cost: '',
    });
    setShowForm(true);
    setError('');
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      assetId: m.assetId,
      issueDescription: m.issueDescription ?? '',
      actionTaken: m.actionTaken ?? '',
      technician: m.technician ?? '',
      maintenanceDate: m.maintenanceDate
        ? new Date(m.maintenanceDate).toISOString().slice(0, 10)
        : '',
      nextServiceDate: m.nextServiceDate
        ? new Date(m.nextServiceDate).toISOString().slice(0, 10)
        : '',
      cost: m.cost != null ? String(m.cost) : '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (m) => {
    if (!window.confirm('Delete this maintenance record?')) return;
    api
      .delete(`/api/ict/maintenance/${m.id}`)
      .then(load)
      .catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.assetId) {
      setError('Select an asset.');
      return;
    }
    setSubmitting(true);
    const payload = {
      assetId: form.assetId,
    };
    if (form.issueDescription.trim()) payload.issueDescription = form.issueDescription.trim();
    if (form.actionTaken.trim()) payload.actionTaken = form.actionTaken.trim();
    if (form.technician.trim()) payload.technician = form.technician.trim();
    if (form.maintenanceDate) payload.maintenanceDate = form.maintenanceDate;
    if (form.nextServiceDate) payload.nextServiceDate = form.nextServiceDate;
    if (form.cost !== '') {
      const costNum = Number(form.cost);
      if (!Number.isNaN(costNum)) payload.cost = costNum;
    }

    const then = () => {
      setShowForm(false);
      setEditing(null);
      load();
    };
    const req = editing
      ? api.patch(`/api/ict/maintenance/${editing.id}`, payload)
      : api.post('/api/ict/maintenance', payload);
    req
      .then(then)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">ICT Asset Maintenance</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Add Maintenance Record
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">
              {editing ? 'Edit Maintenance Record' : 'New Maintenance Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset *
                </label>
                <select
                  required
                  value={form.assetId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      assetId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  disabled={!!editing}
                >
                  <option value="">— Select asset —</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetTag} – {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance task / issue
                </label>
                <input
                  type="text"
                  value={form.issueDescription}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      issueDescription: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="e.g. Preventive maintenance, repair"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details / action taken
                </label>
                <textarea
                  rows={3}
                  value={form.actionTaken}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      actionTaken: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service provider / technician
                </label>
                <input
                  type="text"
                  value={form.technician}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      technician: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviced on
                </label>
                <input
                  type="date"
                  value={form.maintenanceDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      maintenanceDate: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next service
                </label>
                <input
                  type="date"
                  value={form.nextServiceDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      nextServiceDate: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost / amount
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.cost}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      cost: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="e.g. 150000"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-sm"
                >
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Asset
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Task / Issue
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Technician
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Next service
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Cost
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  User
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2 text-sm">
                    {m.asset?.assetTag} – {m.asset?.name}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.issueDescription || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.technician || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.maintenanceDate
                      ? new Date(m.maintenanceDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.nextServiceDate
                      ? new Date(m.nextServiceDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.cost != null
                      ? Number(m.cost).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {m.createdBy?.name ?? m.createdBy?.email ?? '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(m)}
                      className="text-gov-blue text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">
              No maintenance records.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
