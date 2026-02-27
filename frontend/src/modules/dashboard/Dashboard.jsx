import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get('/api/admin/reports/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}. <button type="button" onClick={load} className="underline ml-1">Retry</button></div>;

  const cards = [
    { title: 'Users', value: summary?.users ?? 0, to: '/admin/users' },
    { title: 'ICT Assets', value: summary?.ictAssets ?? 0, to: '/ict/assets' },
    { title: 'Vehicles', value: summary?.vehicles ?? 0, to: '/fleet/vehicles' },
    { title: 'Store Items', value: summary?.storeItems ?? 0, to: '/stores/items' },
    { title: 'Finance Activities', value: summary?.financeActivities ?? 0, to: '/finance/activities' },
  ];
  const pending = summary?.pendingRequisitions ?? {};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Dashboard</h1>
        <button type="button" onClick={load} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className="bg-white rounded-lg shadow border border-gray-100 p-4 block hover:border-gov-blue/30 hover:shadow-md transition-shadow">
            <div className="text-sm text-gov-slate">{c.title}</div>
            <div className="text-2xl font-semibold text-gov-navy mt-1">{c.value}</div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
        <h2 className="font-medium text-gov-navy mb-3">Pending Requisitions</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link to="/ict/requisitions" className="text-gov-blue hover:underline">ICT: <strong>{pending.ict ?? 0}</strong></Link>
          <Link to="/stores/requisitions" className="text-gov-blue hover:underline">Stores: <strong>{pending.stores ?? 0}</strong></Link>
          <Link to="/fleet/requisitions" className="text-gov-blue hover:underline">Fleet: <strong>{pending.fleet ?? 0}</strong></Link>
        </div>
      </div>
    </div>
  );
}
