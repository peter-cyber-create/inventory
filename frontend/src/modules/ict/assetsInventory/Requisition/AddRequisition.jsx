import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AddRequisitionPopup({ asset, onClose, onSaved }) {
  const [form, setForm] = useState({
    requestedBy: '',
    comments: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.requestedBy.trim()) {
      setError('Requested by is required.');
      return;
    }
    const payload = {
      serialNo: asset.serialNumber,
      model: asset.name,
      requestedBy: form.requestedBy.trim(),
      comments: form.comments?.trim() || undefined,
      assetId: asset.id,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/requisition', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save requisition.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="ICT Asset → Stores requisition"
      onClose={onClose}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Serial number">
            <input
              type="text"
              value={asset.serialNumber || ''}
              disabled
              className="ims-input bg-gov-backgroundAlt"
            />
          </FormField>
          <FormField label="Model">
            <input
              type="text"
              value={asset.name || ''}
              disabled
              className="ims-input bg-gov-backgroundAlt"
            />
          </FormField>
        </div>
        <FormField label="Requested by" required>
          <input
            type="text"
            required
            value={form.requestedBy}
            onChange={(e) =>
              setForm((f) => ({ ...f, requestedBy: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Comments">
          <textarea
            rows={3}
            value={form.comments}
            onChange={(e) =>
              setForm((f) => ({ ...f, comments: e.target.value }))
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
            {submitting ? 'Saving…' : 'Save requisition'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

