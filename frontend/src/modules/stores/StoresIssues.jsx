import { useState, useEffect } from 'react';
import api from '../../services/api';

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

  const load = () => {
    api.get('/api/stores/issues').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/stores/requisitions').then((res) => {
        const pending = (res.data || []).filter((r) => (r.status || '').toUpperCase() === 'PENDING');
        setRequisitions(pending);
      }).catch(() => setRequisitions([]));
      api.get('/api/stores/items').then((res) => setItemsWithStock(res.data || [])).catch(() => setItemsWithStock([]));
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
        return { ...l, quantityToIssue: Math.min(l.quantityToIssue, maxQ) };
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
      setError('Set at least one quantity to issue.');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Store Issues</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Issue from Requisition
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">Issue from Requisition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {!selectedReq ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select PENDING requisition</label>
                  <div className="space-y-1 border rounded p-2 max-h-48 overflow-y-auto">
                    {requisitions.length === 0 ? (
                      <p className="text-sm text-gray-500">No PENDING requisitions.</p>
                    ) : (
                      requisitions.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => onSelectRequisition(r)}
                          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 border border-transparent hover:border-gray-300"
                        >
                          {r.department?.name ?? 'No dept'} – {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''} (ID: {r.id?.slice(0, 8)})
                        </button>
                      ))
                    )}
                  </div>
                  <div className="mt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Requisition: {selectedReq.department?.name ?? '-'} ({selectedReq.id?.slice(0, 8)})
                  </p>
                  <div>
                    <button type="button" onClick={() => { setSelectedReq(null); setIssueLines([]); }} className="text-sm text-gov-blue">Change requisition</button>
                  </div>
                  <div className="border rounded overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Item</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-600">Requested</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-600">Approved</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-600">In stock</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-600">Issue qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {issueLines.map((l) => (
                          <tr key={l.itemId}>
                            <td className="px-3 py-2">{l.itemName ?? l.itemId}</td>
                            <td className="px-3 py-2 text-right">{l.quantityRequested}</td>
                            <td className="px-3 py-2 text-right">{l.quantityApproved}</td>
                            <td className="px-3 py-2 text-right">{stockByItemId[l.itemId] ?? 0}</td>
                            <td className="px-3 py-2 text-right">
                              <input
                                type="number"
                                min={0}
                                max={Math.min(l.quantityApproved, stockByItemId[l.itemId] ?? 0)}
                                value={l.quantityToIssue}
                                onChange={(e) => setQuantityToIssue(l.itemId, e.target.value)}
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">
                      {submitting ? 'Issuing...' : 'Issue'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requisition</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Issued By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2 text-sm">{i.requisition?.id?.slice(0, 8) ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.issuedBy?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{i.issueDate ? new Date(i.issueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No issues.</p>}
        </div>
      )}
    </div>
  );
}
