import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import Card from '../../components/ui/Card';

export default function FinanceDashboard() {
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
      <PageLayout title="Finance Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ims-card h-20 animate-pulse bg-gov-backgroundAlt" />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Finance Dashboard" actions={<button type="button" onClick={load} className="ims-btn-secondary">Retry</button>}>
        <p className="text-gov-danger">{error}</p>
      </PageLayout>
    );
  }

  const activities = summary?.financeActivities ?? 0;

  return (
    <PageLayout
      title="Finance Dashboard"
      actions={
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase">Finance Activities</div>
          <div className="text-2xl font-semibold text-gov-primary mt-2">{activities}</div>
          <Link to="/finance/activities" className="text-body-sm text-gov-accent hover:underline mt-2 block">
            View activities
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
}

