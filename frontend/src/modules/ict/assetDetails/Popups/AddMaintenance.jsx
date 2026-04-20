import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AddMaintenancePopup({ asset, onClose, onSaved }) {
  const [form, setForm] = useState({
    taskName: '',
    servicedBy: '',
    servicedOn: '',
    nextService: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.taskName.trim()) {
      setError('Task name is required.');
      return;
    }
    const payload = {
      assetId: asset.id,
      issueDescription: form.taskName.trim(),
      actionTaken: form.description?.trim() || undefined,
      technician: form.servicedBy?.trim() || undefined,
      maintenanceDate: form.servicedOn || undefined,
      nextServiceDate: form.nextService || undefined,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/maintenance', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save maintenance record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="ICT Asset → Maintenance"
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}
        <FormField label="Task name" required>
          <input
            type="text"
            required
            value={form.taskName}
            onChange={(e) =>
              setForm((f) => ({ ...f, taskName: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Serviced by (company/person)">
          <input
            type="text"
            value={form.servicedBy}
            onChange={(e) =>
              setForm((f) => ({ ...f, servicedBy: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Serviced on (date)">
            <input
              type="date"
              value={form.servicedOn}
              onChange={(e) =>
                setForm((f) => ({ ...f, servicedOn: e.target.value }))
              }
              className="ims-input"
            />
          </FormField>
          <FormField label="Next service date">
            <input
              type="date"
              value={form.nextService}
              onChange={(e) =>
                setForm((f) => ({ ...f, nextService: e.target.value }))
              }
              className="ims-input"
            />
          </FormField>
        </div>
        <FormField label="Description / service details">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
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
            {submitting ? 'Saving…' : 'Save maintenance'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

