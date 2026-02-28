import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    healthEmail: '',
    phone: '',
    designation: '',
    module: '',
    isActive: true,
    departmentId: '',
    roleId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = (p = page, q = search) => {
    setLoading(true);
    const params = { page: p, limit };
    if (q) params.search = q;
    api.get('/api/admin/users', { params })
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setList(Array.isArray(d) ? d : []);
        setTotal(res.data?.total ?? d?.length ?? 0);
        setPage(res.data?.page ?? p);
      })
      .catch(() => { setList([]); setTotal(0); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(1, search); }, [search]);

  useEffect(() => {
    if (showForm) {
      api.get('/api/admin/departments').then((res) => setDepartments(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setDepartments([]));
      api.get('/api/admin/roles').then((res) => setRoles(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setRoles([]));
    }
  }, [showForm]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      email: '',
      password: '',
      username: '',
      healthEmail: '',
      phone: '',
      designation: '',
      module: '',
      isActive: true,
      departmentId: '',
      roleId: '',
    });
    setShowForm(true);
    setError('');
  };
  const openEdit = (u) => {
    setEditing(u);
    setForm({
      name: u.name ?? '',
      email: u.email ?? '',
      password: '',
      username: u.username ?? '',
      healthEmail: u.healthEmail ?? '',
      phone: u.phone ?? '',
      designation: u.designation ?? '',
      module: u.module ?? '',
      isActive: u.isActive ?? true,
      departmentId: u.departmentId ?? '',
      roleId: u.roleId ?? '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = (u) => {
    if (!window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    setError('');
    api.delete(`/api/admin/users/${u.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      isActive: form.isActive,
    };
    if (form.username.trim()) payload.username = form.username.trim();
    else if (editing) payload.username = null;
    if (form.healthEmail.trim()) payload.healthEmail = form.healthEmail.trim();
    else if (editing) payload.healthEmail = null;
    if (form.phone.trim()) payload.phone = form.phone.trim();
    else if (editing) payload.phone = null;
    if (form.designation.trim()) payload.designation = form.designation.trim();
    else if (editing) payload.designation = null;
    if (form.module.trim()) payload.module = form.module.trim();
    else if (editing) payload.module = null;
    if (form.departmentId) payload.departmentId = form.departmentId;
    else if (editing) payload.departmentId = null;
    if (form.roleId) payload.roleId = form.roleId;
    else if (editing) payload.roleId = null;
    if (form.password.trim()) payload.password = form.password;

    const then = () => { setShowForm(false); setEditing(null); load(page, search); };
    const req = editing ? api.patch(`/api/admin/users/${editing.id}`, payload) : api.post('/api/admin/users', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">User Management</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
          <input type="text" placeholder="Search name or email" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
          <button type="submit" className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Search</button>
        </form>
        <button type="button" onClick={openCreate} className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90">
          Add User
        </button>
      </div>
      {error && !showForm && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">{editing ? 'Edit User' : 'New User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editing ? 'New password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder={editing ? 'Leave blank to keep current' : ''}
                    autoComplete={editing ? 'new-password' : 'off'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health email</label>
                  <input
                    type="email"
                    value={form.healthEmail}
                    onChange={(e) => setForm((f) => ({ ...f, healthEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select
                    value={form.module}
                    onChange={(e) => setForm((f) => ({ ...f, module: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="IT">IT</option>
                    <option value="Stores">Stores</option>
                    <option value="Fleet">Fleet</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={form.roleId} onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Is active</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Module</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-sm">{u.name}</td>
                  <td className="px-4 py-2 text-sm">{u.email}</td>
                  <td className="px-4 py-2 text-sm">{u.department?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{u.role?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{u.module ?? 'All'}</td>
                  <td className="px-4 py-2 text-sm">{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-2 text-sm">
                    <button type="button" onClick={() => openEdit(u)} className="text-gov-blue text-sm mr-2">Edit</button>
                    <button type="button" onClick={() => handleDelete(u)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No users.</p>}
          {total > limit && (
            <div className="px-4 py-2 border-t border-gray-200 flex justify-between text-sm">
              <span className="text-gray-600">{list.length} of {total}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                <span className="py-1">Page {page}</span>
                <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
