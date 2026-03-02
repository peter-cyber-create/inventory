import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUser } from '../../services/auth';
import PageLayout from '../../components/ui/PageLayout';
import Modal from '../../components/ui/Modal';
import FormMetadataHeader from '../../components/ui/FormMetadataHeader';
import FormSectionCollapsible from '../../components/ui/FormSectionCollapsible';
import FormField from '../../components/ui/FormField';
import LineItemGrid from '../../components/ui/LineItemGrid';
import FormActions from '../../components/ui/FormActions';
import AuditTrailPanel from '../../components/ui/AuditTrailPanel';

export default function StoresGRN() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    supplier: '',
    receivedDate: new Date().toISOString().slice(0, 10),
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
  const currentUser = getUser();

  const load = () => {
    api.get('/api/stores/grn').then((res) => setList(Array.isArray(res.data) ? res.data : (res.data?.data ?? []))).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  useEffect(() => {
    if (showForm) {
      api.get('/api/stores/items', { params: { limit: 500 } }).then((res) => {
        const d = res.data?.data ?? res.data;
        setItems(Array.isArray(d) ? d : []);
      }).catch(() => setItems([]));
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
      receivedDate: form.receivedDate || undefined,
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
      setError('Add at least one line item with quantity.');
      return;
    }
    setSubmitting(true);
    api
      .post('/api/stores/grn', payload)
      .then(() => {
        setShowForm(false);
        setForm({
          supplier: '',
          receivedDate: new Date().toISOString().slice(0, 10),
          contractNo: '', lpoNo: '', deliveryNoteNo: '', taxInvoiceNo: '', grnNo: '',
          supplierContact: '', remarks: '',
          lines: [{ itemId: '', quantity: 1, unitPrice: '' }],
        });
        load();
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setSubmitting(false));
  };

  const getAvailableStock = (line, item) => (item != null ? (item.quantityInStock ?? item.quantity ?? null) : null);

  return (
    <PageLayout
      title="Goods Received Notes (GRN)"
      actions={
        <button type="button" onClick={() => { setShowForm(true); setError(''); }} className="ims-btn-primary">
          Create GRN
        </button>
      }
    >
      {showForm && (
        <Modal title="New GRN" onClose={() => setShowForm(false)} width="max-w-4xl">
          <form onSubmit={handleSubmit} className="p-5">
            {error && <p className="text-body-sm text-gov-danger mb-4">{error}</p>}

            <FormMetadataHeader
              documentNumber={form.grnNo || '—'}
              status="Draft"
              createdBy={currentUser?.name ?? '—'}
              department={currentUser?.department?.name ?? '—'}
              date={form.receivedDate ? new Date(form.receivedDate).toLocaleDateString() : new Date().toLocaleDateString()}
              referenceCode={form.contractNo || form.lpoNo || '—'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-0">
                <FormSectionCollapsible id="grn-supplier" title="Section A – Supplier & Delivery" defaultOpen={true}>
                  <FormField label="Received date" required>
                    <input type="date" required value={form.receivedDate} onChange={(e) => setForm((f) => ({ ...f, receivedDate: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Supplier" required>
                    <input type="text" required value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Supplier contact">
                    <input type="text" value={form.supplierContact} onChange={(e) => setForm((f) => ({ ...f, supplierContact: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Contract No.">
                    <input type="text" value={form.contractNo} onChange={(e) => setForm((f) => ({ ...f, contractNo: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="LPO No.">
                    <input type="text" value={form.lpoNo} onChange={(e) => setForm((f) => ({ ...f, lpoNo: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Delivery note No.">
                    <input type="text" value={form.deliveryNoteNo} onChange={(e) => setForm((f) => ({ ...f, deliveryNoteNo: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="Tax invoice No.">
                    <input type="text" value={form.taxInvoiceNo} onChange={(e) => setForm((f) => ({ ...f, taxInvoiceNo: e.target.value }))} className="ims-input" />
                  </FormField>
                  <FormField label="GRN No.">
                    <input type="text" value={form.grnNo} onChange={(e) => setForm((f) => ({ ...f, grnNo: e.target.value }))} className="ims-input" placeholder="Optional reference" />
                  </FormField>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="grn-lines" title="Section B – Line items" defaultOpen={true}>
                  <div className="md:col-span-2">
                    <LineItemGrid
                      lines={form.lines}
                      onAddLine={addLine}
                      onRemoveLine={removeLine}
                      onUpdateLine={updateLine}
                      itemOptions={items}
                      getItemLabel={(item) => item?.name ?? '—'}
                      getAvailableStock={getAvailableStock}
                      showUnit={false}
                      showAvailableStock={true}
                      showUnitCost={true}
                      showTotal={true}
                      quantityKey="quantity"
                      itemIdKey="itemId"
                      unitPriceKey="unitPrice"
                      minQuantity={1}
                      emptyMessage="Add at least one item. Click '+ Add line'."
                    />
                  </div>
                </FormSectionCollapsible>

                <FormSectionCollapsible id="grn-remarks" title="Section C – Remarks" defaultOpen={false}>
                  <FormField label="Remarks" className="md:col-span-2">
                    <textarea rows={2} value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} className="ims-input" />
                  </FormField>
                </FormSectionCollapsible>

                <FormActions className="mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="ims-btn-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="ims-btn-primary">{submitting ? 'Saving…' : 'Save GRN'}</button>
                </FormActions>
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
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Received Date</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">GRN No.</th>
                <th className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-borderLight">
              {list.map((g) => (
                <tr key={g.id} className="ims-table-row">
                  <td className="px-4 py-3 text-body text-gov-primary">{g.supplier ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{g.receivedDate ? new Date(g.receivedDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{g.grnNo ?? '—'}</td>
                  <td className="px-4 py-3 text-body text-gov-primary">{g.items?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-6 text-body-sm text-gov-secondaryMuted text-center">No GRNs.</p>}
        </div>
      )}
    </PageLayout>
  );
}
