import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Table } from 'antd';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';
import FormSectionCollapsible from '../../../components/ui/FormSectionCollapsible';
import FormField from '../../../components/ui/FormField';
import FormActions from '../../../components/ui/FormActions';

const FUNDERS = [
  'GOU',
  'GF-HIV',
  'GF-COVID',
  'GF-MALARIA',
  'GF-TB',
  'GF-RSSH',
  'GF-COORDINATION',
  'UCREPP',
  'GAVI',
  'ISHSP',
  'CDC',
  'WHO',
];

const DEPARTMENTS = [
  'Health Infrastructure',
  'Health Promotion',
  'AIDS Control Programme',
  'Malaria Programme',
  'ICT Unit',
];

export default function ActivityCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    activityName: '',
    requestedBy: '',
    dept: '',
    invoiceDate: '',
    vocherno: '',
    amt: '',
    funder: '',
  });
  const [rows, setRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/api/finance/activities/participants/import', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imported = Array.isArray(res.data?.rows) ? res.data.rows : res.data;
      const safeRows = (imported || []).map((r, idx) => ({
        key: r.id || idx,
        name: r.name ?? '',
        title: r.title ?? '',
        phone: r.phone ?? '',
        amount: r.amount ?? 0,
        days: r.days ?? 0,
      }));
      // compute flagged rows by phone + days >= 150
      const daysByPhone = new Map();
      safeRows.forEach((r) => {
        const key = (r.phone || '').trim();
        if (!key) return;
        const prev = daysByPhone.get(key) || 0;
        daysByPhone.set(key, prev + (Number(r.days) || 0));
      });
      const flagged = safeRows.map((r) => ({
        ...r,
        isFlagged: ((daysByPhone.get((r.phone || '').trim()) || 0) >= 150),
      }));
      setRows(flagged);
      onSuccess?.('ok');
    } catch (e) {
      const msg = e.response?.data?.error || e.message || 'Failed to import participants file.';
      setError(msg);
      onError?.(new Error(msg));
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    if (!form.activityName.trim()) {
      setError('Activity Name is required.');
      return false;
    }
    if (!form.requestedBy.trim()) {
      setError('Requested By is required.');
      return false;
    }
    if (!form.dept) {
      setError('Requesting Department / Division is required.');
      return false;
    }
    if (!form.invoiceDate) {
      setError('Invoice Date is required.');
      return false;
    }
    if (!form.amt || Number.isNaN(Number(String(form.amt).replace(/,/g, '')))) {
      setError('Enter a valid Total Requisition Amount.');
      return false;
    }
    if (!form.funder) {
      setError('Source of Funding is required.');
      return false;
    }
    const invalidPhone = rows.find((r) => r.phone && !String(r.phone).startsWith('0'));
    if (invalidPhone) {
      setError(`Phone number for "${invalidPhone.name || invalidPhone.phone}" must start with 0.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const amtNumber = Number(String(form.amt).replace(/,/g, '')) || 0;
      const payload = {
        // Map UI fields to backend finance activity schema
        title: form.activityName.trim(),
        description: form.requestedBy ? `Requested by: ${form.requestedBy} (${form.dept})` : undefined,
        amount: amtNumber,
        departmentId: undefined,
        invoiceDate: form.invoiceDate,
        voucherNumber: form.vocherno?.trim() || undefined,
        funder: form.funder,
        status: 'planned',
        participants: rows.map((r) => ({
          name: r.name,
          title: r.title,
          phone: r.phone,
          amount: Number(r.amount) || 0,
          days: Number(r.days) || 0,
        })),
      };
      await api.post('/api/finance/activities', payload);
      navigate('/activities/listing');
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to save activity.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Days', dataIndex: 'days', key: 'days' },
  ];

  const rowClassName = (record) =>
    record.isFlagged ? 'bg-amber-50' : '';

  return (
    <PageLayout
      title="New Finance Activity"
      actions={
        <button type="button" className="ims-btn-secondary" onClick={() => navigate('/activities/listing')}>
          Back to listing
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

        <FormSectionCollapsible id="activity-main" title="Activity Information" defaultOpen>
          <FormField label="Activity Name" required>
            <input
              type="text"
              className="ims-input"
              value={form.activityName}
              onChange={(e) => updateField('activityName', e.target.value)}
            />
          </FormField>
          <FormField label="Requested By" required>
            <input
              type="text"
              className="ims-input"
              value={form.requestedBy}
              onChange={(e) => updateField('requestedBy', e.target.value)}
            />
          </FormField>
          <FormField label="Requesting Department / Division" required>
            <select
              className="ims-input"
              value={form.dept}
              onChange={(e) => updateField('dept', e.target.value)}
            >
              <option value="">— Select —</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Invoice Date" required>
            <input
              type="date"
              className="ims-input"
              value={form.invoiceDate}
              onChange={(e) => updateField('invoiceDate', e.target.value)}
            />
          </FormField>
          <FormField label="Voucher Number (optional)">
            <input
              type="text"
              className="ims-input"
              value={form.vocherno}
              onChange={(e) => updateField('vocherno', e.target.value)}
            />
          </FormField>
        </FormSectionCollapsible>

        <FormSectionCollapsible id="activity-funding" title="Funding Information" defaultOpen>
          <FormField label="Total Requisition Amount" required>
            <input
              type="text"
              className="ims-input"
              value={form.amt}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || /^[0-9]+(\.[0-9]*)?$/.test(raw)) {
                  const parts = raw.split('.');
                  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  const formatted = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
                  updateField('amt', formatted);
                }
              }}
              placeholder="e.g. 1,500,000"
            />
          </FormField>
          <FormField label="Source of Funding" required>
            <select
              className="ims-input"
              value={form.funder}
              onChange={(e) => updateField('funder', e.target.value)}
            >
              <option value="">— Select —</option>
              {FUNDERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </FormField>
        </FormSectionCollapsible>

        <FormSectionCollapsible id="activity-participants" title="Participants" defaultOpen>
          <div className="md:col-span-2 space-y-3">
            <p className="text-body-sm text-gov-secondary">
              Upload an Excel sheet (.xlsx / .xls) with columns: <strong>name</strong>,{' '}
              <strong>title</strong>, <strong>phone</strong>, <strong>amount</strong>,{' '}
              <strong>days</strong>.
            </p>
            <Upload
              accept=".xlsx,.xls"
              customRequest={handleUpload}
              showUploadList={false}
            >
              <button
                type="button"
                className="ims-btn-secondary"
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Upload participants Excel'}
              </button>
            </Upload>
            {rows.length > 0 && (
              <div className="ims-card overflow-hidden">
                <Table
                  columns={columns}
                  dataSource={rows}
                  size="small"
                  pagination={false}
                  rowClassName={rowClassName}
                />
                <p className="px-4 py-2 text-body-xs text-gov-secondaryMuted">
                  Rows highlighted indicate flagged participants (duplicate phone with total days ≥ 150).
                </p>
              </div>
            )}
            {rows.length === 0 && (
              <p className="text-body-sm text-gov-secondaryMuted">
                No participants uploaded yet.
              </p>
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
          <button
            type="submit"
            className="ims-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Activity'}
          </button>
        </FormActions>
      </form>
    </PageLayout>
  );
}

