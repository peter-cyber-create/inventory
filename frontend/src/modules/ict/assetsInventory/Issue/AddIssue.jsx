import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';
import FormActions from '../../../../components/ui/FormActions';
import api from '../../../../services/api';

export default function AddIssuePopup({ asset, onClose, onSaved }) {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    issuedBy: '',
    staffQuery: '',
    staffId: '',
    department: '',
    title: '',
  });
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

  const filteredStaff = useMemo(() => {
    const q = form.staffQuery.trim().toLowerCase();
    if (!q) return staff.slice(0, 20);
    return staff
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.department?.toLowerCase().includes(q) ||
          s.title?.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [staff, form.staffQuery]);

  const handleSelectStaff = (s) => {
    setForm((f) => ({
      ...f,
      staffId: s.id,
      staffQuery: s.name,
      department: s.department || f.department,
      title: s.title || f.title,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.issuedBy.trim() || !form.staffId) {
      setError('Issued by and staff are required.');
      return;
    }
    const selectedStaff = staff.find((s) => s.id === form.staffId);
    const payload = {
      serialNo: asset.serialNumber,
      model: asset.name,
      issuedBy: form.issuedBy.trim(),
      issuedTo: selectedStaff?.name || form.staffQuery || '',
      department: selectedStaff?.department || form.department?.trim() || undefined,
      title: selectedStaff?.title || form.title?.trim() || undefined,
      assetId: asset.id,
    };
    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/issue', payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="ICT Asset → Issue to staff"
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
        <FormField label="Issued by" required>
          <input
            type="text"
            required
            value={form.issuedBy}
            onChange={(e) =>
              setForm((f) => ({ ...f, issuedBy: e.target.value }))
            }
            className="ims-input"
          />
        </FormField>
        <FormField label="Issued to staff" required>
          <div className="relative">
            <input
              type="text"
              required
              value={form.staffQuery}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  staffQuery: e.target.value,
                  staffId: '',
                }))
              }
              className="ims-input"
              placeholder="Type to search staff…"
            />
            {filteredStaff.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-card border border-gov-border bg-white shadow-card">
                {filteredStaff.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStaff(s)}
                    className="block w-full px-3 py-1.5 text-left text-body-sm hover:bg-gov-backgroundAlt"
                  >
                    {s.name}
                    {s.title ? ` – ${s.title}` : ''}
                    {s.department ? ` (${s.department})` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>
        <FormField label="Department / Division">
          <input
            type="text"
            value={form.department}
            onChange={(e) =>
              setForm((f) => ({ ...f, department: e.target.value }))
            }
            className="ims-input"
            placeholder="Auto-filled from staff where available"
          />
        </FormField>
        <FormField label="Employee title">
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            className="ims-input"
            placeholder="Auto-filled from staff where available"
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
            {submitting ? 'Saving…' : 'Save issue'}
          </button>
        </FormActions>
      </form>
    </Modal>
  );
}

