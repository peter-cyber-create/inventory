import { useState } from 'react';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';

export default function ActivitiesPerPerson() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (name.trim()) params.name = name.trim();
      const res = await api.get('/api/finance/reports/person', { params });
      const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setRows(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load activities per person.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Activities per Person">
      <form onSubmit={handleSearch} className="ims-card mb-4 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="ims-label">Name</label>
          <input
            type="text"
            className="ims-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Participant name"
          />
        </div>
        <button type="submit" className="ims-btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gov-borderLight">
            {rows.map((r, idx) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !loading && (
          <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
            No matching participants found.
          </p>
        )}
      </div>
    </PageLayout>
  );
}

