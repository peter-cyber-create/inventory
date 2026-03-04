import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';
import StatusChip from '../../../components/ui/StatusChip';

const PAGE_SIZE = 20;

export default function ActivitiesListing() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = (p = page, q = search) => {
    setLoading(true);
    setError('');
    const params = { page: p, limit: PAGE_SIZE };
    if (q) params.search = q;
    api
      .get('/api/finance/activities', { params })
      .then((res) => {
        const body = res.data;
        const data = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
        setList(data);
        setTotal(body?.total ?? data.length ?? 0);
        setPage(body?.page ?? p);
      })
      .catch((e) => {
        setError(e.response?.data?.error || e.message || 'Failed to load activities.');
        setList([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const goToPage = (p) => {
    if (p < 1) return;
    if (PAGE_SIZE * (p - 1) > total) return;
    load(p, search);
  };

  return (
    <PageLayout
      title="Finance Activities"
      actions={
        <>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              className="ims-input w-48"
              placeholder="Search by activity name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="ims-btn-secondary">
              Search
            </button>
          </form>
          <button
            type="button"
            className="ims-btn-primary"
            onClick={() => navigate('/activities/add')}
          >
            Add New Activity
          </button>
        </>
      }
    >
      {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-hidden">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Activity Name
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Voucher No
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Funder
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((a) => (
                <tr key={a.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.activityName || a.title || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.dept || a.department?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.invoiceDate ? new Date(a.invoiceDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.vocherno || a.voucherNumber || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.amt != null ? Number(a.amt).toLocaleString() : (a.amount != null ? Number(a.amount).toLocaleString() : '—')}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {a.funder || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={a.status || 'Draft'} />
                  </td>
                  <td className="px-4 py-3 text-body-sm text-gov-primary">
                    <button
                      type="button"
                      className="text-gov-accent hover:underline mr-3"
                      onClick={() => navigate(`/activities/${a.id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="text-gov-accent hover:underline"
                      onClick={() => navigate(`/activities/update/${a.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
              No activities found.
            </p>
          )}
          {total > PAGE_SIZE && (
            <div className="px-4 py-3 border-t border-gov-borderLight flex justify-between items-center text-body-sm text-gov-secondary">
              <span>
                {list.length} of {total}
              </span>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </button>
                <span className="py-1">Page {page}</span>
                <button
                  type="button"
                  className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50"
                  disabled={page * PAGE_SIZE >= total}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}

