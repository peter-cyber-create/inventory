import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { clearAuthToken } from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Card from '../../components/ui/Card';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getUser();

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
      <PageLayout title="National Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="ims-card h-28 bg-gov-backgroundAlt rounded-card overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gov-backgroundAlt/60 to-transparent animate-pulse" />
            </div>
          ))}
        </div>
        <div className="ims-card h-40 bg-gov-backgroundAlt rounded-card overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gov-backgroundAlt/60 to-transparent animate-pulse" />
        </div>
      </PageLayout>
    );
  }
  if (error) {
    const is401 = error.includes('Session expired');
    return (
      <PageLayout title="Dashboard">
        <p className={is401 ? 'text-gov-warning' : 'text-gov-danger'}>
          {error}
          {!is401 && (
            <button type="button" onClick={load} className="ims-btn-secondary ml-2">
              Retry
            </button>
          )}
        </p>
      </PageLayout>
    );
  }

  const baseCards = [
    { title: 'Users', value: summary?.users ?? 0, to: '/admin/users', module: 'Admin' },
    { title: 'ICT Assets', value: summary?.ictAssets ?? 0, to: '/ict/assets', module: 'ICT' },
    { title: 'Vehicles', value: summary?.vehicles ?? 0, to: '/fleet/vehicles', module: 'Fleet' },
    { title: 'Store Items', value: summary?.storeItems ?? 0, to: '/stores/items', module: 'Stores' },
    { title: 'Finance Activities', value: summary?.financeActivities ?? 0, to: '/finance/activities', module: 'Finance' },
  ];
  const userModule = (user?.module || '').toLowerCase();
  const cards =
    !userModule || userModule === 'all'
      ? baseCards
      : baseCards.filter((c) => c.module.toLowerCase() === userModule);
  const pending = summary?.pendingRequisitions ?? {};
  const total = (summary?.users ?? 0) + (summary?.ictAssets ?? 0) + (summary?.vehicles ?? 0) + (summary?.storeItems ?? 0) + (summary?.financeActivities ?? 0);
  const allZero = total === 0 && (pending.ict ?? 0) === 0 && (pending.stores ?? 0) === 0 && (pending.fleet ?? 0) === 0;

  return (
    <PageLayout
      title="National Health Inventory Command"
      actions={
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      }
    >
      {allZero && (
        <Card className="mb-6">
          <p className="text-heading-sm text-gov-primary mb-1">Get started</p>
          <p className="text-body text-gov-secondary mb-2">
            No data yet. Add users, store items, ICT assets, vehicles, or finance activities to see counts here.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/users" className="text-body text-gov-accent hover:underline font-medium">Add user</Link>
            <span className="text-gov-border">|</span>
            <Link to="/stores/items" className="text-body text-gov-accent hover:underline font-medium">Add store item</Link>
            <span className="text-gov-border">|</span>
            <Link to="/ict/assets" className="text-body text-gov-accent hover:underline font-medium">Add ICT asset</Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="ims-card p-6 block border border-gov-border hover:shadow-card-hover hover:border-gov-accent/70 transition-all duration-200"
          >
            <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.18em]">
              {c.title}
            </div>
            <div className="text-2xl font-semibold text-gov-primary mt-3">{c.value}</div>
            <div className="mt-3 text-body-xs text-gov-secondaryMuted">
              View {c.title.toLowerCase()} records
            </div>
          </Link>
        ))}
      </div>

      <Card title="Pending Requisitions">
        <div className="flex flex-wrap gap-6 text-body">
          <Link to="/ict/requisitions" className="text-gov-primary hover:text-gov-accent font-medium transition-colors duration-fast">
            ICT: <strong>{pending.ict ?? 0}</strong>
          </Link>
          <Link to="/stores/requisitions" className="text-gov-primary hover:text-gov-accent font-medium transition-colors duration-fast">
            Stores: <strong>{pending.stores ?? 0}</strong>
          </Link>
          <Link to="/fleet/requisitions" className="text-gov-primary hover:text-gov-accent font-medium transition-colors duration-fast">
            Fleet: <strong>{pending.fleet ?? 0}</strong>
          </Link>
        </div>
      </Card>
    </PageLayout>
  );
}
