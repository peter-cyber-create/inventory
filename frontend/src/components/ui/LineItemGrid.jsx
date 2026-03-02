/**
 * Dynamic line-item grid for Requisitions, GRNs, Job Cards, Store Issues.
 * Columns: Item | Quantity | Unit | Available Stock | Unit Cost | Total
 * Real-time calculations, stock validation, prevent negative stock.
 */
export default function LineItemGrid({
  lines,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
  itemOptions = [],
  getItemLabel = (item) => item?.name ?? item?.id ?? '—',
  getAvailableStock = () => null,
  getUnit = () => null,
  quantityKey = 'quantity',
  itemIdKey = 'itemId',
  unitPriceKey = 'unitPrice',
  showUnit = true,
  showAvailableStock = true,
  showUnitCost = true,
  showTotal = true,
  minQuantity = 0,
  disabled = false,
  emptyMessage = 'No line items. Add at least one.',
}) {
  const totalForRow = (line) => {
    const qty = Number(line[quantityKey]) || 0;
    const price = Number(line[unitPriceKey]) || 0;
    return (qty * price).toFixed(2);
  };

  return (
    <div className="border border-gov-border rounded-form overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gov-backgroundAlt border-b border-gov-border">
        <span className="text-label text-gov-secondary uppercase tracking-wide">Line items</span>
        {!disabled && onAddLine && (
          <button type="button" onClick={onAddLine} className="text-body-sm text-gov-accent hover:underline font-medium">
            + Add line
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-body">
          <thead className="bg-gov-backgroundAlt border-b border-gov-border">
            <tr>
              <th className="px-3 py-2 text-left text-label text-gov-secondary uppercase tracking-wider">Item</th>
              <th className="px-3 py-2 text-right text-label text-gov-secondary uppercase tracking-wider w-24">Quantity</th>
              {showUnit && <th className="px-3 py-2 text-left text-label text-gov-secondary uppercase tracking-wider w-20">Unit</th>}
              {showAvailableStock && <th className="px-3 py-2 text-right text-label text-gov-secondary uppercase tracking-wider w-28">Available</th>}
              {showUnitCost && <th className="px-3 py-2 text-right text-label text-gov-secondary uppercase tracking-wider w-28">Unit cost</th>}
              {showTotal && <th className="px-3 py-2 text-right text-label text-gov-secondary uppercase tracking-wider w-28">Total</th>}
              {!disabled && onRemoveLine && <th className="px-3 py-2 w-12" aria-label="Remove" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gov-borderLight">
            {lines.length === 0 ? (
              <tr>
                <td colSpan={showUnit + showAvailableStock + showUnitCost + showTotal + 3} className="px-4 py-6 text-center text-body-sm text-gov-secondaryMuted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              lines.map((line, idx) => {
                const itemId = line[itemIdKey];
                const item = itemOptions.find((i) => i.id === itemId);
                const available = getAvailableStock(line, item);
                const qty = Number(line[quantityKey]) || 0;
                const overStock = showAvailableStock && available != null && qty > available;
                return (
                  <tr key={idx} className={overStock ? 'bg-gov-danger/5' : ''}>
                    <td className="px-3 py-2">
                      {disabled ? (
                        getItemLabel(item)
                      ) : (
                        <select
                          value={itemId}
                          onChange={(e) => onUpdateLine(idx, itemIdKey, e.target.value)}
                          className="ims-input py-1.5 text-body-sm min-w-[180px]"
                        >
                          <option value="">— Select item —</option>
                          {itemOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{getItemLabel(opt)}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {disabled ? (
                        line[quantityKey]
                      ) : (
                        <input
                          type="number"
                          min={minQuantity}
                          value={line[quantityKey]}
                          onChange={(e) => onUpdateLine(idx, quantityKey, e.target.value)}
                          className={`ims-input w-20 text-right py-1.5 ${overStock ? 'border-gov-danger' : ''}`}
                          title={overStock ? 'Quantity exceeds available stock' : ''}
                        />
                      )}
                    </td>
                    {showUnit && (
                      <td className="px-3 py-2 text-gov-secondary text-body-sm">
                        {getUnit(line, item) ?? '—'}
                      </td>
                    )}
                    {showAvailableStock && (
                      <td className="px-3 py-2 text-right text-body-sm text-gov-secondary">
                        {available != null ? available : '—'}
                      </td>
                    )}
                    {showUnitCost && (
                      <td className="px-3 py-2 text-right">
                        {disabled ? (
                          line[unitPriceKey] != null ? Number(line[unitPriceKey]).toFixed(2) : '—'
                        ) : (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line[unitPriceKey] ?? ''}
                            onChange={(e) => onUpdateLine(idx, unitPriceKey, e.target.value)}
                            className="ims-input w-24 text-right py-1.5"
                          />
                        )}
                      </td>
                    )}
                    {showTotal && (
                      <td className="px-3 py-2 text-right font-medium text-gov-primary">
                        {totalForRow(line)}
                      </td>
                    )}
                    {!disabled && onRemoveLine && (
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => onRemoveLine(idx)}
                          className="p-1 text-gov-secondary hover:text-gov-danger rounded"
                          aria-label="Remove line"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
