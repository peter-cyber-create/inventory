import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import Card from '../../components/ui/Card';

export default function FleetDashboard() {
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
      <PageLayout title="Fleet Dashboard">
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
      <PageLayout title="Fleet Dashboard" actions={<button type="button" onClick={load} className="ims-btn-secondary">Retry</button>}>
        <p className="text-gov-danger">{error}</p>
      </PageLayout>
    );
  }

  const vehicles = summary?.vehicles ?? 0;
  const pendingFleetReq = summary?.pendingRequisitions?.fleet ?? 0;

  return (
    <PageLayout
      title="Fleet Dashboard"
      actions={
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase">Vehicles</div>
          <div className="text-2xl font-semibold text-gov-primary mt-2">{vehicles}</div>
          <Link to="/fleet/vehicles" className="text-body-sm text-gov-accent hover:underline mt-2 block">
            View vehicles
          </Link>
        </Card>
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase">Pending Fleet Requisitions</div>
          <div className="text-2xl font-semibold text-gov-primary mt-2">{pendingFleetReq}</div>
          <Link to="/fleet/requisitions" className="text-body-sm text-gov-accent hover:underline mt-2 block">
            View requisitions
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
}

