import { useState } from 'react';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';

const FUNDERS = [
  'GOU',
  'GF-HIV',
  'GF-COVID',
  'GF-MALARIA',
  'GF-TB',
  'GF-RSSH',
  'GF-COORDINATION',
  'UCREPP',
  'GAVI',
];

export default function ActivitiesByFunding() {
  const [selectedFunder, setSelectedFunder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (selectedFunder) params.funder = selectedFunder;
      const res = await api.get('/api/finance/reports/funding', { params });
      const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setRows(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load funding report.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Activities by Funding Source">
      <form onSubmit={handleSearch} className="ims-card mb-4 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="ims-label">Funder</label>
          <select
            className="ims-input"
            value={selectedFunder}
            onChange={(e) => setSelectedFunder(e.target.value)}
          >
            <option value="">— Select —</option>
            {FUNDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="ims-btn-primary"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

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
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !loading && (
          <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
            No activities found for the selected funding source.
          </p>
        )}
      </div>
    </PageLayout>
  );
}

