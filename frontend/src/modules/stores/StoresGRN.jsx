import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StoresGRN() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    supplier: '',
    contractNo: '',
    lpoNo: '',
    deliveryNoteNo: '',
    taxInvoiceNo: '',
    grnNo: '',
    supplierContact: '',
    remarks: '',
    lines: [{ itemId: '', quantity: 1, unitPrice: '' }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/api/stores/grn').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/stores/items').then((res) => setItems(res.data)).catch(() => setItems([]));
    }
  }, [showForm]);

  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { itemId: '', quantity: 1, unitPrice: '' }] }));
  const removeLine = (idx) => setForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));
  const updateLine = (idx, field, value) => setForm((f) => ({
    ...f,
    lines: f.lines.map((l, i) => i === idx ? { ...l, [field]: value } : l),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      supplier: form.supplier.trim() || undefined,
      contractNo: form.contractNo.trim() || undefined,
      lpoNo: form.lpoNo.trim() || undefined,
      deliveryNoteNo: form.deliveryNoteNo.trim() || undefined,
      taxInvoiceNo: form.taxInvoiceNo.trim() || undefined,
      grnNo: form.grnNo.trim() || undefined,
      supplierContact: form.supplierContact.trim() || undefined,
      remarks: form.remarks.trim() || undefined,
      items: form.lines.filter((l) => l.itemId && l.quantity >= 1).map((l) => {
        const o = { itemId: l.itemId, quantity: Number(l.quantity) };
        if (l.unitPrice !== '' && !Number.isNaN(Number(l.unitPrice))) o.unitPrice = Number(l.unitPrice);
        return o;
      }),
    };
    if (payload.items.length === 0) {
      setError('Add at least one item with quantity.');
      return;
    }
    setSubmitting(true);
    api
      .post('/api/stores/grn', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          supplier: '',
          contractNo: '',
          lpoNo: '',
          deliveryNoteNo: '',
          taxInvoiceNo: '',
          grnNo: '',
          supplierContact: '',
          remarks: '',
          lines: [{ itemId: '', quantity: 1, unitPrice: '' }],
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gov-navy">Goods Received Notes (GRN)</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90"
        >
          Create GRN
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gov-navy mb-4">New GRN</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier contact</label>
                  <input
                    type="text"
                    value={form.supplierContact}
                    onChange={(e) => setForm((f) => ({ ...f, supplierContact: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract No.</label>
                  <input
                    type="text"
                    value={form.contractNo}
                    onChange={(e) => setForm((f) => ({ ...f, contractNo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LPO No.</label>
                  <input
                    type="text"
                    value={form.lpoNo}
                    onChange={(e) => setForm((f) => ({ ...f, lpoNo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery note No.</label>
                  <input
                    type="text"
                    value={form.deliveryNoteNo}
                    onChange={(e) => setForm((f) => ({ ...f, deliveryNoteNo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax invoice No.</label>
                  <input
                    type="text"
                    value={form.taxInvoiceNo}
                    onChange={(e) => setForm((f) => ({ ...f, taxInvoiceNo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GRN No.</label>
                  <input
                    type="text"
                    value={form.grnNo}
                    onChange={(e) => setForm((f) => ({ ...f, grnNo: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Line items</label>
                  <button type="button" onClick={addLine} className="text-sm text-gov-blue">+ Add line</button>
                </div>
                <div className="space-y-2">
                  {form.lines.map((line, idx) => (
                    <div key={idx} className="flex gap-2 items-center flex-wrap">
                      <select
                        required
                        value={line.itemId}
                        onChange={(e) => updateLine(idx, 'itemId', e.target.value)}
                        className="flex-1 min-w-[140px] border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select item</option>
                        {items.map((it) => (
                          <option key={it.id} value={it.id}>{it.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={line.quantity}
                        onChange={(e) => updateLine(idx, 'quantity', e.target.value ? parseInt(e.target.value, 10) : 0)}
                        className="w-20 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Unit price"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(idx, 'unitPrice', e.target.value)}
                        className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeLine(idx)} className="text-red-600 text-sm">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={form.remarks}
                  onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-gov-blue text-white rounded text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save GRN'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm">Cancel</button>
              </div>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Supplier</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Received Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">GRN No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-2 text-sm">{g.supplier ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{g.receivedDate ? new Date(g.receivedDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-sm">{g.grnNo ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{g.items?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No GRNs.</p>}
        </div>
      )}
    </div>
  );
}
