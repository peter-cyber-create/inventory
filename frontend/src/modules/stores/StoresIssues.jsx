import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import FormSectionCollapsible from '../../components/ui/FormSectionCollapsible';
import FormActions from '../../components/ui/FormActions';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

export default function StoresIssues() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [requisitions, setRequisitions] = useState([]);
  const [itemsWithStock, setItemsWithStock] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [issueLines, setIssueLines] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getUser();

  const load = () => {
    api.get('/api/stores/issues').then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/stores/requisitions').then((res) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setRequisitions(raw.filter((r) => (r.status || '').toUpperCase() === 'PENDING'));
      }).catch(() => setRequisitions([]));
      api.get('/api/stores/items', { params: { limit: 500 } }).then((res) => setItemsWithStock(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setItemsWithStock([]));
    }
  }, [showForm]);

  const stockByItemId = Object.fromEntries((itemsWithStock || []).map((i) => [i.id, i.quantityInStock ?? 0]));

  const onSelectRequisition = (req) => {
    setSelectedReq(req);
    const lines = (req.items || []).map((ri) => ({
      itemId: ri.itemId,
      itemName: ri.item?.name,
      quantityRequested: ri.quantityRequested ?? 0,
      quantityApproved: ri.quantityApproved ?? ri.quantityRequested ?? 0,
      quantityToIssue: Math.min(ri.quantityApproved ?? ri.quantityRequested ?? 0, stockByItemId[ri.itemId] ?? 0) || 0,
    }));
    setIssueLines(lines);
  };

  useEffect(() => {
    if (selectedReq && issueLines.length && itemsWithStock.length) {
      setIssueLines((prev) => prev.map((l) => {
        const stock = stockByItemId[l.itemId] ?? 0;
        const maxQ = Math.min(l.quantityApproved, stock);
        const clamped = Math.min(l.quantityToIssue, maxQ);
        return { ...l, quantityToIssue: clamped > 0 ? clamped : maxQ };
      }));
    }
  }, [itemsWithStock.length, selectedReq?.id]);

  const setQuantityToIssue = (itemId, value) => {
    const line = issueLines.find((l) => l.itemId === itemId);
    if (!line) return;
    const maxQ = Math.min(line.quantityApproved, stockByItemId[itemId] ?? 0);
    const q = Math.max(0, Math.min(Number(value) || 0, maxQ));
    setIssueLines((prev) => prev.map((l) => l.itemId === itemId ? { ...l, quantityToIssue: q } : l));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setError('');
    const items = issueLines.filter((l) => l.quantityToIssue > 0).map((l) => ({ itemId: l.itemId, quantity: l.quantityToIssue }));
    if (items.length === 0) {
      setError('Enter a quantity in the Issue qty column for at least one item, or ensure items have stock.');
      return;
    }
    setSubmitting(true);
    api
      .post('/api/stores/issues', { requisitionId: selectedReq.id, items })
      .then(() => {
        setShowForm(false);
        setSelectedReq(null);
        setIssueLines([]);
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <PageLayout
      title="Store Issues"
      actions={
        <button type="button" onClick={() => { setShowForm(true); setError(''); setSelectedReq(null); setIssueLines([]); }} className="ims-btn-primary">
          Issue from Requisition
        </button>
      }
    >
      {showForm && (
        <Modal title="Issue from Requisition" onClose={() => { setShowForm(false); setSelectedReq(null); setIssueLines([]); }} width="max-w-3xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            {selectedReq && (
              <FormMetadataHeader
                documentNumber={selectedReq.id?.slice(0, 8) ?? '—'}
                status="PENDING"
                createdBy={selectedReq.requester?.name ?? '—'}
                department={selectedReq.department?.name ?? '—'}
                date={selectedReq.createdAt ? new Date(selectedReq.createdAt).toLocaleDateString() : '—'}
                referenceCode={selectedReq.serialNumber ?? '—'}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="issue-select" title="Section A – Select requisition" defaultOpen={true}>
                  <div className="md:col-span-2">
                    {!selectedReq ? (
                      <>
                        <p className="text-body text-gov-secondary mb-2">Select a PENDING requisition to issue from.</p>
                        <div className="space-y-1 border border-gov-border rounded-form p-2 max-h-48 overflow-y-auto bg-gov-surface">
                          {requisitions.length === 0 ? (
                            <p className="text-body-sm text-gov-secondaryMuted">No PENDING requisitions.</p>
                          ) : (
                            requisitions.map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => onSelectRequisition(r)}
                                className="w-full text-left px-3 py-2 rounded-form text-body border border-gov-border bg-gov-surface hover:bg-gov-backgroundAlt text-gov-primary"
                              >
                                {r.department?.name ?? 'No dept'} – {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''} (ID: {r.id?.slice(0, 8)})
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-body text-gov-primary">
                          Requisition: {selectedReq.department?.name ?? '—'} ({selectedReq.id?.slice(0, 8)})
                        </p>
                        <button type="button" onClick={() => { setSelectedReq(null); setIssueLines([]); }} className="text-body-sm text-gov-accent hover:underline font-medium">Change requisition</button>
                      </div>
                    )}
                  </div>
                </FormSectionCollapsible>

                {selectedReq && (
                  <FormSectionCollapsible id="issue-lines" title="Section B – Issue quantities" defaultOpen={true}>
                    <div className="md:col-span-2">
                      {issueLines.length === 0 ? (
                        <p className="text-body-sm text-gov-secondaryMuted py-2">This requisition has no line items. Create a new requisition with items first.</p>
                      ) : (
                        <div className="border border-gov-border rounded-form overflow-hidden">
                          <table className="min-w-full text-body">
                            <thead className="ims-table-header">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-gov-secondary">Item</th>
                                <th className="px-3 py-2 text-right font-medium text-gov-secondary">Requested</th>
                                <th className="px-3 py-2 text-right font-medium text-gov-secondary">Approved</th>
                                <th className="px-3 py-2 text-right font-medium text-gov-secondary">In stock</th>
                                <th className="px-3 py-2 text-right font-medium text-gov-secondary">Issue qty</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gov-borderLight bg-gov-surface">
                              {issueLines.map((l) => (
                                <tr key={l.itemId} className="ims-table-row">
                                  <td className="px-3 py-2 text-gov-primary">{l.itemName ?? l.itemId}</td>
                                  <td className="px-3 py-2 text-right text-gov-primary">{l.quantityRequested}</td>
                                  <td className="px-3 py-2 text-right text-gov-primary">{l.quantityApproved}</td>
                                  <td className="px-3 py-2 text-right text-gov-primary">{stockByItemId[l.itemId] ?? 0}</td>
                                  <td className="px-3 py-2 text-right">
                                    <input
                                      type="number"
                                      min={0}
                                      max={Math.min(l.quantityApproved, stockByItemId[l.itemId] ?? 0)}
                                      value={l.quantityToIssue}
                                      onChange={(e) => setQuantityToIssue(l.itemId, e.target.value)}
                                      className="ims-input w-20 text-right inline-block"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {issueLines.length > 0 && (
                        <p className="text-label text-gov-secondaryMuted mt-2">Enter or adjust the quantity to issue per row. Default is the maximum (min of approved and in stock).</p>
                      )}
                    </div>
                  </FormSectionCollapsible>
                )}

                {selectedReq && (
                  <FormActions className="mt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="ims-btn-secondary">Cancel</button>
                    <button type="submit" disabled={submitting || issueLines.length === 0} className="ims-btn-primary">{submitting ? 'Issuing…' : 'Issue'}</button>
                  </FormActions>
                )}
              </div>
              <div>
                <AuditTrailPanel createdBy={currentUser?.name} />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {loading ? (
        <p className="text-body text-gov-secondary">Loading…</p>
      ) : (
        <div className="ims-card overflow-hidden">
          <table className="min-w-full divide-y divide-gov-border">
            <thead className="ims-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Requisition</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Issued By</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((i) => (
                <tr key={i.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{i.requisition?.id?.slice(0, 8) ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{i.issuedBy?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{i.issueDate ? new Date(i.issueDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">No issues.</p>}
        </div>
      )}
    </PageLayout>
  );
}
