import { useMemo, useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';
import { getUser } from '../../../../services/auth';

export default function AddReturnPopup({ asset, onClose, onSaved }) {
  const currentUser = getUser();
  const defaultReturnedBy = useMemo(
    () => currentUser?.name || currentUser?.email || '',
    [currentUser],
  );

  const [form, setForm] = useState({
    returnedBy: defaultReturnedBy,
    reason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const returnedBy = form.returnedBy?.trim();
    if (!returnedBy) {
      setError('Returned by is required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/return', {
        assetId: asset.id,
        returnedBy,
        reason: form.reason?.trim() || undefined,
      });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to return asset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="ICT Asset → Return to inventory" onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Asset Tag">
            <input
              type="text"
              value={asset.assetTag || ''}
              disabled
              className="ims-input bg-gov-backgroundAlt"
            />
          </FormField>
          <FormField label="Serial No.">
            <input
              type="text"
              value={asset.serialNumber || ''}
              disabled
              className="ims-input bg-gov-backgroundAlt"
            />
          </FormField>
        </div>

        <FormField label="Returned by" required>
          <input
            type="text"
            required
            value={form.returnedBy}
            onChange={(e) => setForm((f) => ({ ...f, returnedBy: e.target.value }))}
            className="ims-input"
          />
        </FormField>

        <FormField label="Return reason (optional)">
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            className="ims-input"
          />
        </FormField>

        <FormActions className="mt-2">
          <button type="button" onClick={onClose} className="ims-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="ims-btn-primary">
            {submitting ? 'Returning…' : 'Return asset'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

