import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/api/finance/activities/${id}`)
      .then((res) => {
        if (cancelled) return;
        setActivity(res.data || null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.response?.data?.error || e.message || 'Failed to load activity.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Activity Details">
        <p className="text-body text-gov-secondary">Loading…</p>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Activity Details"
        actions={
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/activities/listing')}
          >
            Back to listing
          </button>
        }
      >
        <p className="text-body-sm text-gov-danger mb-4">{error}</p>
      </PageLayout>
    );
  }

  if (!activity) {
    return (
      <PageLayout
        title="Activity Details"
        actions={
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/activities/listing')}
          >
            Back to listing
          </button>
        }
      >
        <p className="text-body text-gov-secondaryMuted">Activity not found.</p>
      </PageLayout>
    );
  }

  const participants = Array.isArray(activity.participants) ? activity.participants : [];

  return (
    <PageLayout
      title="Activity Details"
      actions={
        <>
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/activities/listing')}
          >
            Back
          </button>
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate(`/activities/update/${activity.id}`)}
          >
            Edit Activity
          </button>
        </>
      }
    >
      <div className="ims-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Activity Name
            </p>
            <p className="text-body text-gov-primary">
              {activity.activityName || activity.title || '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Requested By
            </p>
            <p className="text-body text-gov-primary">
              {activity.requested_by || activity.requestedBy || '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Department
            </p>
            <p className="text-body text-gov-primary">
              {activity.dept || activity.department?.name || '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Invoice Date
            </p>
            <p className="text-body text-gov-primary">
              {activity.invoiceDate
                ? new Date(activity.invoiceDate).toLocaleDateString()
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Voucher Number
            </p>
            <p className="text-body text-gov-primary">
              {activity.vocherno || activity.voucherNumber || '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Amount
            </p>
            <p className="text-body text-gov-primary">
              {activity.amt != null
                ? Number(activity.amt).toLocaleString()
                : activity.amount != null
                ? Number(activity.amount).toLocaleString()
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Funder
            </p>
            <p className="text-body text-gov-primary">{activity.funder || '—'}</p>
          </div>
          <div>
            <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
              Status
            </p>
            <p className="text-body text-gov-primary">{activity.status || 'Draft'}</p>
          </div>
        </div>
      </div>

      <div className="ims-card">
        <div className="px-4 py-3 border-b border-gov-borderLight">
          <h2 className="text-heading-sm text-gov-primary font-medium">Participants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {participants.map((p, idx) => (
                <tr key={p.id || idx} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {p.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {p.title || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {p.phone || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {p.days != null ? Number(p.days) : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {p.amount != null ? Number(p.amount).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {participants.length === 0 && (
            <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
              No participants recorded for this activity.
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

