import { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';

export default function ActivityPerParticipant() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/api/finance/reports/participant/activity')
      .then((res) => {
        const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setRows(data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Failed to load activity per participant.');
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const parts = [
        r.name,
        r.title,
        r.phone,
        r.activityName,
        r.activity,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return parts.includes(q);
    });
  }, [rows, search]);

  const openExcel = () => {
    window.open('/api/finance/reports/participant/activity/export/excel', '_blank');
  };

  const openPdf = () => {
    window.open('/api/finance/reports/participant/activity/export/pdf', '_blank');
  };

  return (
    <PageLayout
      title="Activity per Participant"
      actions={
        <>
          <input
            type="text"
            className="ims-input w-48"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={openExcel}
          >
            Download Excel
          </button>
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={openPdf}
          >
            Download PDF
          </button>
        </>
      }
    >
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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Voucher No
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Funder
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {filtered.map((r, idx) => (
                <tr key={r.id || idx}>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.name || '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.title || '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.phone || '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.activityName || r.activity || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.days != null ? Number(r.days) : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.amount != null ? Number(r.amount).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.invoiceDate ? new Date(r.invoiceDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {r.vocherno || r.voucherNumber || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">{r.funder || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
              No records found.
            </p>
          )}
        </div>
      )}
    </PageLayout>
  );
}

