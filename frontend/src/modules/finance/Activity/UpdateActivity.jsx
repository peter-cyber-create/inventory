import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';
import FormSectionCollapsible from '../../../components/ui/FormSectionCollapsible';
import FormField from '../../../components/ui/FormField';
import FormActions from '../../../components/ui/FormActions';

export default function UpdateActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [activity, setActivity] = useState({
    activityName: '',
    dept: '',
    invoiceDate: '',
    vocherno: '',
    days: '',
    amt: '',
    funder: '',
    status: '',
  });
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/api/finance/activities/${id}`)
      .then((res) => {
        if (cancelled) return;
        const a = res.data || {};
        setActivity({
          activityName: a.activityName || a.title || '',
          dept: a.dept || a.department || '',
          invoiceDate: a.invoiceDate ? a.invoiceDate.slice(0, 10) : '',
          vocherno: a.vocherno || a.voucherNumber || '',
          days: a.days != null ? String(a.days) : '',
          amt: a.amt != null ? String(a.amt) : (a.amount != null ? String(a.amount) : ''),
          funder: a.funder || '',
          status: a.status || '',
        });
        const rawParticipants = Array.isArray(a.participants) ? a.participants : [];
        setParticipants(
          rawParticipants.map((p, idx) => ({
            key: p.id || idx,
            name: p.name || '',
            title: p.title || '',
            phone: p.phone || '',
            amount: p.amount != null ? String(p.amount) : '',
            days: p.days != null ? String(p.days) : '',
          })),
        );
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.response?.data?.error || e.message || 'Failed to load activity.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = (field, value) => {
    setActivity((prev) => ({ ...prev, [field]: value }));
  };

  const updateParticipant = (index, field, value) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      { key: `new-${prev.length}`, name: '', title: '', phone: '', amount: '', days: '' },
    ]);
  };

  const removeParticipant = (index) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!activity.activityName.trim()) {
      setError('Activity Name is required.');
      return;
    }
    if (!activity.dept) {
      setError('Department is required.');
      return;
    }
    if (!activity.invoiceDate) {
      setError('Invoice Date is required.');
      return;
    }
    const invalidPhone = participants.find((p) => p.phone && !String(p.phone).startsWith('0'));
    if (invalidPhone) {
      setError(`Phone number for "${invalidPhone.name || invalidPhone.phone}" must start with 0.`);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: activity.activityName.trim(),
        invoiceDate: activity.invoiceDate,
        voucherNumber: activity.vocherno || undefined,
        days: activity.days !== '' ? Number(activity.days) || 0 : undefined,
        amount: activity.amt !== '' ? Number(activity.amt) || 0 : undefined,
        funder: activity.funder,
        status: activity.status,
        participants: participants.map((p) => ({
          name: p.name,
          title: p.title,
          phone: p.phone,
          amount: p.amount !== '' ? Number(p.amount) || 0 : 0,
          days: p.days !== '' ? Number(p.days) || 0 : 0,
        })),
      };
      await api.patch(`/api/finance/activities/${id}`, payload);
      navigate('/activities/listing');
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to update activity.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Update Activity">
        <p className="text-body text-gov-secondary">Loading…</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Update Activity"
      actions={
        <button
          type="button"
          className="ims-btn-secondary"
          onClick={() => navigate('/activities/listing')}
        >
          Back to listing
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

        <FormSectionCollapsible id="activity-details" title="Activity Details" defaultOpen>
          <FormField label="Activity Name" required>
            <input
              type="text"
              className="ims-input"
              value={activity.activityName}
              onChange={(e) => updateField('activityName', e.target.value)}
            />
          </FormField>
          <FormField label="Department" required>
            <input
              type="text"
              className="ims-input"
              value={activity.dept}
              onChange={(e) => updateField('dept', e.target.value)}
            />
          </FormField>
          <FormField label="Invoice Date" required>
            <input
              type="date"
              className="ims-input"
              value={activity.invoiceDate}
              onChange={(e) => updateField('invoiceDate', e.target.value)}
            />
          </FormField>
          <FormField label="Voucher Number">
            <input
              type="number"
              className="ims-input"
              value={activity.vocherno}
              onChange={(e) => updateField('vocherno', e.target.value)}
            />
          </FormField>
          <FormField label="Amount">
            <input
              type="number"
              className="ims-input"
              value={activity.amt}
              onChange={(e) => updateField('amt', e.target.value)}
            />
          </FormField>
          <FormField label="Funder">
            <input
              type="text"
              className="ims-input"
              value={activity.funder}
              onChange={(e) => updateField('funder', e.target.value)}
            />
          </FormField>
          <FormField label="Status">
            <select
              className="ims-input"
              value={activity.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="">— Select —</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Days">
            <input
              type="number"
              className="ims-input"
              value={activity.days}
              onChange={(e) => updateField('days', e.target.value)}
            />
          </FormField>
        </FormSectionCollapsible>

        <FormSectionCollapsible
          id="activity-participants-manage"
          title="Participants"
          defaultOpen={false}
        >
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-gov-secondary">Participants</span>
              <button
                type="button"
                className="text-body-sm text-gov-accent hover:underline font-medium"
                onClick={addParticipant}
              >
                + Add participant
              </button>
            </div>
            {participants.length === 0 ? (
              <p className="text-body-sm text-gov-secondaryMuted">
                No participants yet. Click &quot;+ Add participant&quot; to add.
              </p>
            ) : (
              <div className="space-y-2">
                {participants.map((p, idx) => (
                  <div
                    key={p.key || idx}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Name"
                      className="ims-input py-1.5 text-body-sm"
                      value={p.name}
                      onChange={(e) => updateParticipant(idx, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      className="ims-input py-1.5 text-body-sm"
                      value={p.title}
                      onChange={(e) => updateParticipant(idx, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      className="ims-input py-1.5 text-body-sm"
                      value={p.phone}
                      onChange={(e) => updateParticipant(idx, 'phone', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="ims-input py-1.5 text-body-sm"
                      value={p.amount}
                      onChange={(e) => updateParticipant(idx, 'amount', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Days"
                        className="ims-input py-1.5 text-body-sm w-20"
                        value={p.days}
                        onChange={(e) => updateParticipant(idx, 'days', e.target.value)}
                      />
                      <button
                        type="button"
                        className="text-gov-danger hover:underline text-body-sm"
                        onClick={() => removeParticipant(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormSectionCollapsible>

        <FormActions>
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/activities/listing')}
          >
            Cancel
          </button>
          <button type="submit" className="ims-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </FormActions>
      </form>
    </PageLayout>
  );
}

