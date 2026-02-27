import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function IctServers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    ipAddress: '',
    location: '',
    status: 'active',
    serialNumber: '',
    engravedNumber: '',
    brand: '',
    productNumber: '',
    type: 'physical',
    hostServerId: '',
  });
  const [physicalHosts, setPhysicalHosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/api/ict/servers')
      .then((res) => {
        const data = res.data || [];
        setList(data);
        setPhysicalHosts(data.filter((s) => (s.type || 'physical') === 'physical'));
      })
      .catch(() => {
        setList([]);
        setPhysicalHosts([]);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      ipAddress: form.ipAddress.trim(),
      status: form.status,
      type: form.type,
    };
    if (form.location.trim()) payload.location = form.location.trim();
    if (form.serialNumber.trim()) payload.serialNumber = form.serialNumber.trim();
    if (form.engravedNumber.trim()) payload.engravedNumber = form.engravedNumber.trim();
    if (form.brand.trim()) payload.brand = form.brand.trim();
    if (form.productNumber.trim()) payload.productNumber = form.productNumber.trim();
    if (form.type === 'virtual' && form.hostServerId) payload.hostServerId = form.hostServerId;
    api
      .post('/api/ict/servers', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          name: '',
          ipAddress: '',
          location: '',
          status: 'active',
          serialNumber: '',
          engravedNumber: '',
          brand: '',
          productNumber: '',
          type: 'physical',
          hostServerId: '',
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Servers</h1>
        <button type="button" onClick={() => setShowForm(true)} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Register Server
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">
              {form.type === 'virtual' ? 'Virtual Server – Step 1' : 'Physical Server – Step 1'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Server Type *</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value,
                      hostServerId: e.target.value === 'virtual' ? f.hostServerId : '',
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Server name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial number</label>
                  <input
                    type="text"
                    value={form.serialNumber}
                    onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engraved number</label>
                  <input
                    type="text"
                    value={form.engravedNumber}
                    onChange={(e) => setForm((f) => ({ ...f, engravedNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    <option value="HP">HP</option>
                    <option value="Dell">Dell</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product number</label>
                  <input
                    type="text"
                    value={form.productNumber}
                    onChange={(e) => setForm((f) => ({ ...f, productNumber: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IP Address *</label>
                <input type="text" required value={form.ipAddress} onChange={(e) => setForm((f) => ({ ...f, ipAddress: e.target.value }))} placeholder="e.g. 192.168.1.1" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              {form.type === 'virtual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host server *</label>
                  <select
                    required
                    value={form.hostServerId}
                    onChange={(e) => setForm((f) => ({ ...f, hostServerId: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">— Select physical host —</option>
                    {physicalHosts.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.ipAddress})
                      </option>
                    ))}
                  </select>
                  {physicalHosts.length === 0 && (
                    <p className="mt-1 text-xs text-gray-500">No physical servers registered yet.</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">IP Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-sm">{s.name}</td>
                  <td className="px-4 py-2 text-sm">{s.ipAddress}</td>
                  <td className="px-4 py-2 text-sm">{s.location ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No servers recorded.</p>}
        </div>
      )}
    </div>
  );
}
