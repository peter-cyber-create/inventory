import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import AddReturnPopup from './assetDetails/Popups/AddReturn.jsx';

export default function IctAssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asset, setAsset] = useState(null);
  const [tab, setTab] = useState('overview');
  const [showReturnPopup, setShowReturnPopup] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get(`/api/ict/assets/${id}`)
      .then((res) => {
        if (cancelled) return;
        setAsset(res.data || null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.response?.data?.error || e.message || 'Failed to load asset.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'requisitions', label: 'Requisitions' },
    { id: 'issues', label: 'Issues' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'returns', label: 'Returns' },
    { id: 'disposals', label: 'Disposals' },
  ];

  if (loading) {
    return (
      <PageLayout title="ICT Asset Details">
        <p className="text-body text-gov-secondary">Loading…</p>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="ICT Asset Details"
        actions={
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/ict/assets')}
          >
            Back to assets
          </button>
        }
      >
        <p className="text-body-sm text-gov-danger mb-4">{error}</p>
      </PageLayout>
    );
  }

  if (!asset) {
    return (
      <PageLayout
        title="ICT Asset Details"
        actions={
          <button
            type="button"
            className="ims-btn-secondary"
            onClick={() => navigate('/ict/assets')}
          >
            Back to assets
          </button>
        }
      >
        <p className="text-body text-gov-secondaryMuted">Asset not found.</p>
      </PageLayout>
    );
  }

  const assetTitle = `${asset.assetTag} – ${asset.name}`;
  const status = String(asset.status || '').toLowerCase();
  const statusTone =
    status === 'available'
      ? 'bg-green-100 text-green-800'
      : status === 'assigned'
        ? 'bg-blue-100 text-blue-800'
        : status === 'maintenance'
          ? 'bg-amber-100 text-amber-800'
          : status === 'disposed'
            ? 'bg-gray-200 text-gray-700'
            : 'bg-gray-100 text-gray-700';
  const nextActionText =
    status === 'available'
      ? 'Next action: issue, transfer, or disposal is allowed.'
      : status === 'assigned'
        ? 'Next action: return asset before transfer or disposal.'
        : status === 'maintenance'
          ? 'Next action: return to inventory when maintenance is complete.'
          : 'This asset is disposed and now read-only for lifecycle actions.';

  const renderOverview = () => (
    <div className="ims-card mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Asset Tag
          </p>
          <p className="text-body text-gov-primary">{asset.assetTag}</p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Name / Model
          </p>
          <p className="text-body text-gov-primary">{asset.name}</p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Category
          </p>
          <p className="text-body text-gov-primary">{asset.category}</p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Serial Number
          </p>
          <p className="text-body text-gov-primary">
            {asset.serialNumber || '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Status
          </p>
          <p className="text-body text-gov-primary">
            {asset.status || 'available'}
          </p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Location / Department
          </p>
          <p className="text-body text-gov-primary">
            {asset.location || '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Assigned by
          </p>
          <p className="text-body text-gov-primary">
            {asset.assignedTo?.name || '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Purchase Date
          </p>
          <p className="text-body text-gov-primary">
            {asset.purchaseDate
              ? new Date(asset.purchaseDate).toLocaleDateString()
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-gov-secondaryMuted uppercase tracking-wide mb-1">
            Created At
          </p>
          <p className="text-body text-gov-primary">
            {asset.createdAt
              ? new Date(asset.createdAt).toLocaleDateString()
              : '—'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTable = (rows, columns, emptyMessage) => (
    <div className="ims-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gov-border">
          <thead className="ims-table-header">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gov-borderLight">
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="ims-table-row">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-body text-gov-primary"
                  >
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );

  const assetRequisitions = asset.assetRequisitions ?? [];
  const directIssues = asset.directIssues ?? [];
  const maintenance = asset.maintenance ?? [];
  const issues = asset.issues ?? [];
  const transfers = asset.transfers ?? [];
  const returns = asset.returns ?? [];
  const disposals = asset.disposals ?? [];

  let content = null;
  if (tab === 'overview') {
    content = renderOverview();
  } else if (tab === 'requisitions') {
    content = renderTable(
      assetRequisitions,
      [
        { key: 'createdAt', label: 'Date', render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') },
        { key: 'serialNo', label: 'Serial No' },
        { key: 'model', label: 'Model' },
        { key: 'requestedBy', label: 'Requested By' },
        { key: 'comments', label: 'Comments' },
      ],
      'No per-asset requisitions recorded for this asset.',
    );
  } else if (tab === 'issues') {
    content = renderTable(
      [...issues, ...directIssues],
      [
        { key: 'issueDate', label: 'Date', render: (r) => (r.issueDate || r.createdAt ? new Date(r.issueDate || r.createdAt).toLocaleDateString() : '—') },
        { key: 'serialNo', label: 'Serial No', render: (r) => r.serialNo || asset.serialNumber || '—' },
        { key: 'model', label: 'Model', render: (r) => r.model || asset.name || '—' },
        {
          key: 'issuedTo',
          label: 'Issued To',
          render: (r) => r.issuedTo?.name || r.issuedTo || r.issuedToId || '—',
        },
        {
          key: 'source',
          label: 'Source',
          render: (r) => (r.requisitionId ? 'From requisition' : 'Direct issue'),
        },
      ],
      'No issues recorded for this asset.',
    );
  } else if (tab === 'maintenance') {
    content = renderTable(
      maintenance,
      [
        { key: 'maintenanceDate', label: 'Serviced On', render: (r) => (r.maintenanceDate ? new Date(r.maintenanceDate).toLocaleDateString() : '—') },
        { key: 'issueDescription', label: 'Task / Issue' },
        { key: 'technician', label: 'Technician' },
        { key: 'nextServiceDate', label: 'Next Service', render: (r) => (r.nextServiceDate ? new Date(r.nextServiceDate).toLocaleDateString() : '—') },
        {
          key: 'cost',
          label: 'Cost',
          render: (r) =>
            r.cost != null
              ? Number(r.cost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '—',
        },
      ],
      'No maintenance records for this asset.',
    );
  } else if (tab === 'transfers') {
    content = renderTable(
      transfers,
      [
        { key: 'createdAt', label: 'Date', render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') },
        { key: 'previousUser', label: 'Previous User' },
        { key: 'user', label: 'New User' },
        { key: 'department', label: 'New Department' },
        { key: 'reason', label: 'Reason' },
      ],
      'No transfers recorded for this asset.',
    );
  } else if (tab === 'returns') {
    content = renderTable(
      returns,
      [
        { key: 'returnDate', label: 'Return Date', render: (r) => (r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '—') },
        { key: 'returnedBy', label: 'Returned By' },
        { key: 'reason', label: 'Reason' },
      ],
      'No returns recorded for this asset.',
    );
  } else if (tab === 'disposals') {
    content = renderTable(
      disposals,
      [
        { key: 'disposalDate', label: 'Disposal Date', render: (r) => (r.disposalDate ? new Date(r.disposalDate).toLocaleDateString() : '—') },
        { key: 'disposalMethod', label: 'Method' },
        { key: 'disposalReason', label: 'Reason' },
        {
          key: 'disposalCost',
          label: 'Cost',
          render: (r) =>
            r.disposalCost != null
              ? Number(r.disposalCost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '—',
        },
        { key: 'disposedBy', label: 'Disposed By' },
      ],
      'No disposals recorded for this asset.',
    );
  }

  const refetchAsset = () => {
    api
      .get(`/api/ict/assets/${id}`)
      .then((res) => setAsset(res.data || null))
      .catch((e) => setError(e.response?.data?.error || e.message || 'Failed to load asset.'));
  };

  const canReturn = (asset.status || '').toLowerCase() !== 'available' && (asset.status || '').toLowerCase() !== 'disposed';

  return (
    <>
      <PageLayout
        title={assetTitle}
        subtitle="Lifecycle history and controlled next actions."
        actions={
          <>
            <button
              type="button"
              className="ims-btn-secondary"
              onClick={() => navigate('/ict/assets')}
            >
              Back to assets
            </button>
            {canReturn && (
              <button
                type="button"
                className="ims-btn-primary"
                onClick={() => setShowReturnPopup(true)}
              >
                Return asset
              </button>
            )}
          </>
        }
      >
        <div className="ims-card mb-4 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-gov-secondary">Current status:</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-body-xs font-medium ${statusTone}`}>
              {asset.status || '—'}
            </span>
          </div>
          <p className="text-body-sm text-gov-secondary">{nextActionText}</p>
        </div>

        <div className="mb-4 border-b border-gov-borderLight">
          <nav className="-mb-px flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={
                  'px-3 py-2 text-body-sm border-b-2 transition-colors ' +
                  (tab === t.id
                    ? 'border-gov-accent text-gov-primary font-medium'
                    : 'border-transparent text-gov-secondary hover:text-gov-primary hover:border-gov-border')
                }
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        {content}
      </PageLayout>
      {showReturnPopup && asset && (
        <AddReturnPopup
          asset={asset}
          onClose={() => setShowReturnPopup(false)}
          onSaved={() => {
            setShowReturnPopup(false);
            refetchAsset();
          }}
        />
      )}
    </>
  );
}

