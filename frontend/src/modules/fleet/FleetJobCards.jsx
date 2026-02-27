import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUS_OPTIONS = ['open', 'closed'];

export default function FleetJobCards() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', vehicleId: '' });
  const [form, setForm] = useState({
    vehicleId: '',
    issueDescription: '',
    assignedToId: '',
    startDate: '',
    status: 'open',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.vehicleId) params.vehicleId = filters.vehicleId;
    api
      .get('/api/fleet/job-cards', { params })
      .then((res) => setList(res.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, [filters.status, filters.vehicleId]);

  useEffect(() => {
    api
      .get('/api/fleet/vehicles')
      .then((res) => setVehicles(res.data || []))
      .catch(() => setVehicles([]));
    api
      .get('/api/admin/users')
      .then((res) => setUsers(res.data || []))
      .catch(() => setUsers([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      vehicleId: '',
      issueDescription: '',
      assignedToId: '',
      startDate: '',
      status: 'open',
      endDate: '',
    });
    setShowForm(true);
    setError('');
  };

  const openEdit = (j) => {
    setEditing(j);
    setForm({
      vehicleId: j.vehicleId,
      issueDescription: j.issueDescription ?? '',
      assignedToId: j.assignedToId ?? '',
      startDate: j.startDate ? new Date(j.startDate).toISOString().slice(0, 10) : '',
      status: j.status ?? 'open',
      endDate: j.endDate ? new Date(j.endDate).toISOString().slice(0, 10) : '',
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.vehicleId) {
      setError('Select a vehicle.');
      return;
    }
    setSubmitting(true);
    const payload = {
      vehicleId: form.vehicleId,
    };
    if (form.issueDescription.trim()) payload.issueDescription = form.issueDescription.trim();
    if (form.assignedToId) payload.assignedToId = form.assignedToId;
    else if (editing) payload.assignedToId = null;
    if (form.startDate) payload.startDate = form.startDate;
    if (form.endDate) payload.endDate = form.endDate;
    if (form.status) payload.status = form.status;

    const then = () => {
      setShowForm(false);
      setEditing(null);
      load();
    };
    const req = editing
      ? api.patch(`/api/fleet/job-cards/${editing.id}`, payload)
      : api.post('/api/fleet/job-cards', payload);
    req
      .then(then)
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const handleClose = (j) => {
    if (!window.confirm('Close this job card?')) return;
    api
      .post(`/api/fleet/job-cards/${j.id}/close`)
      .then(load)
      .catch((err) => setError(err.response?.data?.error || err.message));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Fleet Job Cards</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Add Job Card
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <div className="bg-white rounded-lg shadow border mb-4 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle</label>
          <select
            value={filters.vehicleId}
            onChange={(e) => setFilters((f) => ({ ...f, vehicleId: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[180px]"
          >
            <option value="">All vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} – {v.make} {v.model}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={load}
          className="ml-auto px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">
              {editing ? 'Edit Job Card' : 'New Job Card'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle *
                </label>
                <select
                  required
                  value={form.vehicleId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      vehicleId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  disabled={!!editing}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue / work requested
                </label>
                <textarea
                  rows={3}
                  value={form.issueDescription}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      issueDescription: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned technician
                </label>
                <select
                  value={form.assignedToId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      assignedToId: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">— None —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                  Vehicle
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Issue
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Assigned To
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Start
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  End
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-2 text-sm">
                    {j.vehicle?.registrationNumber} – {j.vehicle?.make} {j.vehicle?.model}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {j.issueDescription || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {j.assignedTo?.name || '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {j.startDate ? new Date(j.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {j.endDate ? new Date(j.endDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {j.status}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(j)}
                      className="text-gov-blue text-sm mr-2"
                    >
                      Edit
                    </button>
                    {j.status !== 'closed' && (
                      <button
                        type="button"
                        onClick={() => handleClose(j)}
                        className="text-amber-700 text-sm mr-2"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">
              No job cards.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
