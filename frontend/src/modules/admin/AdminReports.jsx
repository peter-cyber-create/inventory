import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get('/api/admin/reports/summary').then((res) => setSummary(res.data)).catch(() => { setSummary(null); setError('Failed to load summary.'); }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const cards = [
    { label: 'Users', value: summary?.users ?? 0 },
    { label: 'ICT Assets', value: summary?.ictAssets ?? 0 },
    { label: 'Vehicles', value: summary?.vehicles ?? 0 },
    { label: 'Store Items', value: summary?.storeItems ?? 0 },
    { label: 'Finance Activities', value: summary?.financeActivities ?? 0 },
    { label: 'Pending ICT Requisitions', value: summary?.pendingRequisitions?.ict ?? 0 },
    { label: 'Pending Store Requisitions', value: summary?.pendingRequisitions?.stores ?? 0 },
    { label: 'Pending Fleet Requisitions', value: summary?.pendingRequisitions?.fleet ?? 0 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">System Reports</h1>
        <button type="button" onClick={load} disabled={loading} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
          Refresh
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg shadow border p-4">
            <dt className="text-sm font-medium text-gray-600 truncate">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-gov-navy">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
