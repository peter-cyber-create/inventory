import { useEffect, useState } from 'react';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';
import AddFinanceUser from './AddUser';

export default function FinanceUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const load = (q = search) => {
    setLoading(true);
    setError('');
    const params = {};
    if (q) params.search = q;
    api
      .get('/api/admin/users', { params })
      .then((res) => {
        const body = res.data;
        let data = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
        // Filter to Finance module users only
        data = data.filter((u) => (u.module || '').toLowerCase() === 'finance');
        setUsers(data);
      })
      .catch((e) => {
        setError(e.response?.data?.error || e.message || 'Failed to load finance users.');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    setSearch(q);
    load(q);
  };

  return (
    <PageLayout
      title="Finance Users"
      actions={
        <>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              className="ims-input w-48"
              placeholder="Search by name or username"
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
            onClick={() => setShowAdd(true)}
          >
            Add New User
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
                  Username
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Module
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Fund manager
                </th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {users.map((u) => (
                <tr key={u.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {u.username || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {u.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {u.module || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {u.depart || u.department || '—'}
                  </td>
                  <td className="px-4 py-3 text-body text-gov-primary">
                    {u.email || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
              No finance users found.
            </p>
          )}
        </div>
      )}

      <AddFinanceUser
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => load(search)}
      />
    </PageLayout>
  );
}

