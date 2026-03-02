import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import FormSection from '../../components/ui/FormSection';
import FormField from '../../components/ui/FormField';
import FormActions from '../../components/ui/FormActions';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

const INITIAL_FORM = {
  name: '', email: '', password: '', username: '', healthEmail: '', phone: '', designation: '', module: '',
  isActive: true, departmentId: '', roleId: '',
};

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
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
    setForm(INITIAL_FORM);
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
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (u) => {
    if (!window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    api.delete(`/api/admin/users/${u.id}`).then(() => load(page, search)).catch((err) => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { name: form.name.trim(), email: form.email.trim(), isActive: form.isActive };
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
    const then = () => { closeForm(); load(page, search); };
    const req = editing ? api.patch(`/api/admin/users/${editing.id}`, payload) : api.post('/api/admin/users', payload);
    req.then(then).catch((err) => setError(err.response?.data?.error || err.message)).finally(() => setSubmitting(false));
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department', render: (r) => r.department?.name ?? '—' },
    { key: 'role', label: 'Role', render: (r) => r.role?.name ?? '—' },
    { key: 'module', label: 'Module', render: (r) => r.module ?? 'All' },
    { key: 'isActive', label: 'Status', render: (r) => r.isActive ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <span className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="text-gov-primary hover:underline text-body-sm">Edit</button>
          <button type="button" onClick={() => handleDelete(r)} className="text-gov-danger hover:underline text-body-sm">Delete</button>
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="User Management"
      actions={
        <>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex gap-2">
            <input type="text" placeholder="Search name or email" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="ims-input w-48" />
            <button type="submit" className="ims-btn-secondary">Search</button>
          </form>
          <button type="button" onClick={openCreate} className="ims-btn-primary">Add User</button>
        </>
      }
    >
      {error && !showForm && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

      {showForm && (
        <Modal title={editing ? 'Edit User' : 'New User'} onClose={closeForm} width="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}
            <FormMetadataHeader
              documentNumber={(editing?.email ?? form.email) || '—'}
              status={form.isActive ? 'Active' : 'Inactive'}
              createdBy={editing?.createdBy ?? '—'}
              department={editing?.department?.name ?? (departments.find((d) => d.id === form.departmentId)?.name ?? '—')}
              date={editing?.createdAt ? new Date(editing.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
            />
            <FormSection title="General Information">
              <FormField label="Full name" required>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Username">
                <input type="text" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Email" required>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label={editing ? 'New password' : 'Password'}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="ims-input"
                  placeholder={editing ? 'Leave blank to keep current' : ''}
                  autoComplete={editing ? 'new-password' : 'off'}
                />
              </FormField>
            </FormSection>
            <FormSection title="Details">
              <FormField label="Health email">
                <input type="email" value={form.healthEmail} onChange={(e) => setForm((f) => ({ ...f, healthEmail: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Phone">
                <input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Designation">
                <input type="text" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} className="ims-input" />
              </FormField>
              <FormField label="Module (category)">
                <select value={form.module} onChange={(e) => setForm((f) => ({ ...f, module: e.target.value }))} className="ims-input">
                  <option value="">All modules</option>
                  <option value="ICT">ICT Assets</option>
                  <option value="Fleet">Fleet Management</option>
                  <option value="Stores">Stores Management</option>
                  <option value="Finance">Finance</option>
                  <option value="Admin">Administration</option>
                </select>
              </FormField>
            </FormSection>
            <FormSection title="Assignment">
              <FormField label="Department">
                <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="ims-input">
                  <option value="">— None —</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </FormField>
              <FormField label="Role">
                <select value={form.roleId} onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))} className="ims-input">
                  <option value="">— None —</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </FormField>
              <FormField label="Is active">
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-gov-border" />
                  <label htmlFor="isActive" className="text-body text-gov-secondary">Active</label>
                </div>
              </FormField>
            </FormSection>
            <AuditTrailPanel createdBy={getUser()?.name} createdAt={editing?.createdAt} modifiedAt={editing?.updatedAt} className="mb-4" />
            <FormActions>
              <button type="button" onClick={closeForm} className="ims-btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
            </FormActions>
          </form>
        </Modal>
      )}

      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        emptyMessage="No users."
        paginationSlot={
          total > limit ? (
            <div className="flex items-center gap-2 text-body-sm text-gov-secondary">
              <span>{list.length} of {total}</span>
              <button type="button" disabled={page <= 1} onClick={() => load(page - 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Prev</button>
              <span>Page {page}</span>
              <button type="button" disabled={page * limit >= total} onClick={() => load(page + 1, search)} className="ims-btn-secondary py-1 px-2 text-body-sm disabled:opacity-50">Next</button>
            </div>
          ) : null
        }
      />
    </PageLayout>
  );
}
