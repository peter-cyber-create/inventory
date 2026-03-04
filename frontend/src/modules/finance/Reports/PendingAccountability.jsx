import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';

export default function PendingAccountability() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/api/finance/reports/accountability')
      .then((res) => {
        const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setRows(data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Failed to load pending accountability.');
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageLayout title="Pending Accountability">
      {error && (
        <p className="text-body-sm text-gov-danger mb-4">
          {error}{' '}
          <button type="button" className="ims-btn-link" onClick={load}>
            Retry
          </button>
        </p>
      )}
      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-x-auto">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.activityName || r.title || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.dept || r.department?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.invoiceDate ? new Date(r.invoiceDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.amt != null
                      ? Number(r.amt).toLocaleString()
                      : r.amount != null
                      ? Number(r.amount).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-gov-primary">
                    <button
                      type="button"
                      className="ims-btn-secondary py-1 px-3 text-body-xs"
                      onClick={() => navigate(`/activities/participants/${r.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && !loading && (
            <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
              No pending accountability records.
            </p>
          )}
        </div>
      )}
    </PageLayout>
  );
}

