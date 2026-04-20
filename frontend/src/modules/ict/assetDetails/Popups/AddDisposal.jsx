import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AddDisposalPopup({ asset, onClose, onSaved }) {
  const [form, setForm] = useState({
    disposalDate: '',
    disposalMethod: '',
    disposalCost: '',
    disposedBy: '',
    disposalReason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.disposalDate || !form.disposalMethod.trim() || !form.disposedBy.trim()) {
      setError('Disposal date, method and disposed by are required.');
      return;
    }
    const payload = {
      disposalDate: form.disposalDate,
      disposalMethod: form.disposalMethod.trim(),
      disposalReason: form.disposalReason?.trim() || undefined,
      disposalCost: form.disposalCost ? Number(form.disposalCost) : undefined,
      disposedBy: form.disposedBy.trim(),
      assetId: asset.id,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/disposal', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save disposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="ICT Asset → Disposal"
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Disposal date" required>
            <input
              type="date"
              required
              value={form.disposalDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, disposalDate: e.target.value }))
              }
              className="ims-input"
            />
          </FormField>
          <FormField label="Disposal method" required>
            <input
              type="text"
              required
              value={form.disposalMethod}
              onChange={(e) =>
                setForm((f) => ({ ...f, disposalMethod: e.target.value }))
              }
              className="ims-input"
            />
          </FormField>
        </div>
        <FormField label="Disposal cost">
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.disposalCost}
            onChange={(e) =>
              setForm((f) => ({ ...f, disposalCost: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Disposed by" required>
          <input
            type="text"
            required
            value={form.disposedBy}
            onChange={(e) =>
              setForm((f) => ({ ...f, disposedBy: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Disposal reason">
          <textarea
            rows={3}
            value={form.disposalReason}
            onChange={(e) =>
              setForm((f) => ({ ...f, disposalReason: e.target.value }))
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
            {submitting ? 'Saving…' : 'Save disposal'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

