import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import PageLayout from '../../../components/ui/PageLayout';
import FormActions from '../../../components/ui/FormActions';
import Step2AssetLines from './Stepper/Step2';

export default function AddAssetBulk() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    { asset: '', category: '', model: '', serialNo: '', engravedNo: '', funding: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { asset: '', category: '', model: '', serialNo: '', engravedNo: '', funding: '' },
    ]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validRows = rows.filter(
      (r) => r.asset.trim() && r.category && r.model && r.serialNo.trim(),
    );
    if (validRows.length === 0) {
      setError('Add at least one ICT asset line with required fields.');
      return;
    }

    const payload = {
      rows: validRows.map((r) => ({
        asset: r.asset.trim(),
        model: r.model,
        serialNo: r.serialNo?.trim() || undefined,
        engravedNo: r.engravedNo?.trim() || undefined,
        funding: r.funding,
        category: r.category,
      })),
    };

    setSubmitting(true);
    try {
      await api.post('/api/ict/assets/bulk', payload);
      setSuccess('Assets captured successfully.');
      setRows([
        { asset: '', category: '', model: '', serialNo: '', engravedNo: '', funding: '' },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save assets.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setError('');
    try {
      const res = await api.get('/api/ict/assets/bulk/template', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ict_assets_template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to download template.',
      );
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/ict/assets/bulk/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imported = res.data?.rows;
      if (Array.isArray(imported) && imported.length) {
        setRows(
          imported.map((r) => ({
            asset: r.asset || '',
            category: r.category || '',
            model: r.model || '',
            serialNo: r.serialNo || '',
            engravedNo: r.engravedNo || '',
            funding: r.funding || '',
          })),
        );
        setSuccess('Template imported. Review and click Save assets.');
      } else {
        setError('No rows found in uploaded file.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to import template.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <PageLayout
      title="ICT Assets – Bulk capture"
      actions={
        <button
          type="button"
          onClick={() => navigate('/ict/assets')}
          className="ims-btn-secondary"
        >
          Back to assets
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-body-sm text-gov-danger">{error}</p>}
        {success && <p className="text-body-sm text-gov-success">{success}</p>}

        <div className="ims-card mb-4 p-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="ims-btn-secondary"
          >
            Download Excel template
          </button>
          <div className="flex items-center gap-2">
            <label className="text-body-sm text-gov-secondary">
              Import from Excel:
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="text-body-sm"
            />
          </div>
        </div>

        <Step2AssetLines
          rows={rows}
          onChange={setRows}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
        />

        <FormActions className="mt-4">
          <button
            type="button"
            onClick={() => navigate('/ict/assets')}
            className="ims-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="ims-btn-primary"
          >
            {submitting ? 'Saving…' : 'Save assets'}
          </button>
        </FormActions>
      </form>
    </PageLayout>
  );
}

