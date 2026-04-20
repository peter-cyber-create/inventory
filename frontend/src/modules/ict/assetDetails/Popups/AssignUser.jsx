import { useEffect, useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AssignUserPopup({ asset, onClose, onSaved }) {
  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/api/ict/staff')
      .then((res) => {
        const d = res.data ?? [];
        setStaff(Array.isArray(d) ? d : []);
      })
      .catch(() => setStaff([]));
  }, []);

  if (!asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!issuedBy.trim() || !staffId) {
      setError('Issued by and Staff are required.');
      return;
    }
    const payload = {
      issuedBy: issuedBy.trim(),
      staffId,
      assetId: asset.id,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/assign-staff', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to assign staff.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="ICT Asset → Assign to staff"
      onClose={onClose}
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}
        <FormField label="Issued by" required>
          <input
            type="text"
            required
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            className="ims-input"
          />
        </FormField>
        <FormField label="Staff" required>
          <select
            required
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="ims-input"
          >
            <option value="">— Select staff —</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
            {submitting ? 'Saving…' : 'Assign'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

