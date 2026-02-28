import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { clearAuthToken } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get('/api/admin/reports/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => {
        const msg = err.response?.data?.error || err.message;
        if (err.response?.status === 401) {
          clearAuthToken();
          setError('Session expired. Please sign in again.');
          setTimeout(() => navigate('/login', { replace: true }), 1500);
        } else {
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, [navigate]);

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-24" />
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg h-20" />
      </div>
    );
  }
  if (error) {
    const is401 = error.includes('Session expired');
    return (
      <div className="p-6">
        <p className={is401 ? 'text-amber-700' : 'text-red-600'}>
          {error}
          {!is401 && (
            <button type="button" onClick={load} className="underline ml-1">Retry</button>
          )}
        </p>
      </div>
    );
  }

  const cards = [
    { title: 'Users', value: summary?.users ?? 0, to: '/admin/users' },
    { title: 'ICT Assets', value: summary?.ictAssets ?? 0, to: '/ict/assets' },
    { title: 'Vehicles', value: summary?.vehicles ?? 0, to: '/fleet/vehicles' },
    { title: 'Store Items', value: summary?.storeItems ?? 0, to: '/stores/items' },
    { title: 'Finance Activities', value: summary?.financeActivities ?? 0, to: '/finance/activities' },
  ];
  const pending = summary?.pendingRequisitions ?? {};
  const total = (summary?.users ?? 0) + (summary?.ictAssets ?? 0) + (summary?.vehicles ?? 0) + (summary?.storeItems ?? 0) + (summary?.financeActivities ?? 0);
  const allZero = total === 0 && (pending.ict ?? 0) === 0 && (pending.stores ?? 0) === 0 && (pending.fleet ?? 0) === 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Dashboard</h1>
        <button type="button" onClick={load} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
          Refresh
        </button>
      </div>
      {allZero && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gov-slate">
          <p className="font-medium text-gov-navy mb-1">Get started</p>
          <p>No data yet. Add users, store items, ICT assets, vehicles, or finance activities to see counts here.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/admin/users" className="text-gov-blue hover:underline">Add user</Link>
            <Link to="/stores/items" className="text-gov-blue hover:underline">Add store item</Link>
            <Link to="/ict/assets" className="text-gov-blue hover:underline">Add ICT asset</Link>
          </div>
        </div>
      )}
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
