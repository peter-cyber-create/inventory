import { useState } from 'react';
import api from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';
import FormActions from '../../../components/ui/FormActions';

const MODULE_OPTIONS = ['Finance', 'All modules'];

const DEPART_OPTIONS = ['Global Fund', 'UCREPP', 'GAVI', 'GOU'];

export default function AddFinanceUser({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    module: 'Finance',
    depart: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }
    if (!form.firstname.trim() || !form.lastname.trim()) {
      setError('First name and last name are required.');
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!form.module || !form.depart) {
      setError('Module and funding accountant / fund manager are required.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        // Backend expects a single name + email; we map
        name: `${form.firstname.trim()} ${form.lastname.trim()}`,
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        module: form.module,
        // Store fund manager/category in designation so it’s not lost
        designation: form.depart,
      };
      await api.post('/api/admin/users', payload);
      onCreated?.();
      onClose();
      setForm({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        module: 'Finance',
        depart: '',
        email: '',
      });
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to add finance user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add Finance User" onClose={onClose} width="max-w-xl">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger mb-2">{error}</p>}

        <FormField label="Username" required>
          <input
            type="text"
            className="ims-input"
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
          />
        </FormField>
        <FormField label="Password" required>
          <input
            type="password"
            className="ims-input"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </FormField>
        <FormField label="First name" required>
          <input
            type="text"
            className="ims-input"
            value={form.firstname}
            onChange={(e) => updateField('firstname', e.target.value)}
          />
        </FormField>
        <FormField label="Last name" required>
          <input
            type="text"
            className="ims-input"
            value={form.lastname}
            onChange={(e) => updateField('lastname', e.target.value)}
          />
        </FormField>
        <FormField label="System module" required>
          <select
            className="ims-input"
            value={form.module}
            onChange={(e) => updateField('module', e.target.value)}
          >
            <option value="">— Select —</option>
            {MODULE_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Funding accountant / fund manager" required>
          <select
            className="ims-input"
            value={form.depart}
            onChange={(e) => updateField('depart', e.target.value)}
          >
            <option value="">— Select —</option>
            {DEPART_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            className="ims-input"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </FormField>

        <FormActions>
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="ims-btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save User'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

