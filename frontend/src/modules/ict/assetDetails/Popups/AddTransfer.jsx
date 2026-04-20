import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AddTransferPopup({ asset, owner, onClose, onSaved }) {
  const [form, setForm] = useState({
    user: '',
    department: '',
    title: '',
    officeNo: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.user.trim() || !form.department.trim()) {
      setError('New user and department are required.');
      return;
    }
    const payload = {
      user: form.user.trim(),
      department: form.department.trim(),
      title: form.title?.trim() || undefined,
      officeNo: form.officeNo?.trim() || undefined,
      reason: form.reason?.trim() || undefined,
      assetId: asset.id,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/transfer', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save transfer.');
    } finally {
      setSubmitting(false);
    }
  };

  const previousUser = owner?.issuedTo;
  const previousDept = owner?.department;
  const previousTitle = owner?.title;

  return (
    <Modal
      title="ICT Asset → Transfer ownership"
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}

        {(previousUser || previousDept || previousTitle) && (
          <div className="border border-gov-border rounded-card p-3 text-body-sm text-gov-secondary">
            <div className="font-medium text-gov-primary mb-1">
              Current assignment
            </div>
            <div> User: {previousUser || '—'} </div>
            <div> Department: {previousDept || '—'} </div>
            <div> Title: {previousTitle || '—'} </div>
          </div>
        )}

        <FormField label="New user" required>
          <input
            type="text"
            required
            value={form.user}
            onChange={(e) =>
              setForm((f) => ({ ...f, user: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="New department" required>
          <input
            type="text"
            required
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="New user title">
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="New office number">
          <input
            type="text"
            value={form.officeNo}
            onChange={(e) =>
              setForm((f) => ({ ...f, officeNo: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Transfer reason">
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) =>
              setForm((f) => ({ ...f, reason: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>

        <FormActions className="mt-2">
          <button
            type="button"
            onClick={onClose}
            className="ims-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="ims-btn-primary"
          >
            {submitting ? 'Saving…' : 'Save transfer'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

