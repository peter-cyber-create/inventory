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
      <PageLayout title="Finance Command View">
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
        title="Finance Command View"
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

  const activities = summary?.financeActivities ?? 0;
  const budget = summary?.financeBudget ?? 0;
  const participants = summary?.financeParticipants ?? 0;
  const flaggedUsers = summary?.flaggedFinanceUsers ?? 0;

  return (
    <PageLayout
      title="Finance Command View"
      actions={
        <button type="button" onClick={load} className="ims-btn-secondary">
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Finance Budget
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">
            {Number(budget).toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Finance Activities
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">
            {activities}
          </div>
          <Link
            to="/activities/listing"
            className="text-body-sm text-gov-accent hover:underline mt-3 inline-flex items-center gap-1"
          >
            View activities
          </Link>
        </Card>
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Participants
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">
            {participants}
          </div>
        </Card>
        <Card>
          <div className="text-label text-gov-secondaryMuted uppercase tracking-[0.14em]">
            Flagged Users
          </div>
          <div className="text-2xl font-semibold text-gov-primary mt-3">
            {flaggedUsers}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-heading-sm text-gov-primary mb-1">Quick Actions</p>
            <p className="text-body-sm text-gov-secondary">
              Jump directly to common finance workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/activities/add" className="ims-btn-primary text-body-xs">
              New Activity
            </Link>
            <Link to="/activities/listing" className="ims-btn-secondary text-body-xs">
              Activities Listing
            </Link>
            <Link to="/finance/users" className="ims-btn-secondary text-body-xs">
              Finance Users
            </Link>
            <Link to="/report/activities" className="ims-btn-secondary text-body-xs">
              Activities by Date
            </Link>
            <Link to="/report/funding" className="ims-btn-secondary text-body-xs">
              By Funding Source
            </Link>
            <Link to="/report/person" className="ims-btn-secondary text-body-xs">
              Activities per Person
            </Link>
            <Link to="/report/accountability" className="ims-btn-secondary text-body-xs">
              Pending Accountability
            </Link>
            <Link to="/report/flagged" className="ims-btn-secondary text-body-xs">
              Flagged Users
            </Link>
            <Link
              to="/report/participant/activity"
              className="ims-btn-secondary text-body-xs"
            >
              Activity per Participant
            </Link>
            <Link to="/report/user/amounts" className="ims-btn-secondary text-body-xs">
              Users’ Amounts
            </Link>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}

