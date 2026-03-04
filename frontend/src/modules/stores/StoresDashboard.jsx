import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import Card from '../../components/ui/Card';

export default function StoresDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/api/admin/reports/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) {
    return (
      <PageLayout title="Stores Command View">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="ims-card h-24 bg-gov-backgroundAlt rounded-card overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gov-backgroundAlt/70 to-transparent animate-pulse" />
            </div>
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Stores Command View"
        actions={
          <button type="button" onClick={load} className="ims-btn-secondary">
            Retry
          </button>
        }
      >
        <p className="text-gov-danger">{error}</p>
      </PageLayout>
    );
  }

  const storeItems = summary?.storeItems ?? 0;
  const pendingStoresReq = summary?.pendingRequisitions?.stores ?? 0;

  return (
    <PageLayout
      title="Stores Command View"
      actions={
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Store Items
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">{storeItems}</div>
          <Link
            to="/stores/items"
            className="text-body-sm text-gov-accent hover:underline mt-3 inline-flex items-center gap-1"
          >
            View items
          </Link>
        </Card>
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Pending Store Requisitions
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">{pendingStoresReq}</div>
          <Link
            to="/stores/requisitions"
            className="text-body-sm text-gov-accent hover:underline mt-3 inline-flex items-center gap-1"
          >
            View requisitions
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
}

