import FormSectionCollapsible from '../../../../components/ui/FormSectionCollapsible';
import FormField from '../../../../components/ui/FormField';

const ICT_DEVICE_OPTIONS = [
  'Laptop',
  'Desktop',
  'Printer',
  'Keyboard',
  'Mouse',
  'Monitor',
  'Tablet',
  'TV Screen',
];
const CATEGORY_OPTIONS = ['Desktop', 'Laptop', 'Tablet', 'Printer', 'TV Screen'];
const MODEL_OPTIONS = ['Dell', 'HP', 'Lanovo'];
const FUNDING_OPTIONS = ['GOU', 'URMCHIP', 'UCREPP', 'GLOBAL FUND'];

export default function Step2AssetLines({ rows, onChange, onAddRow, onRemoveRow }) {
  const updateRow = (index, patch) => {
    const next = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange(next);
  };

  return (
    <FormSectionCollapsible
      id="ict-add-asset-step2"
      title="Step 2 – ICT asset line items"
      defaultOpen
    >
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="border border-gov-border rounded-card p-3 grid grid-cols-1 md:grid-cols-6 gap-3"
          >
            <FormField label="ICT device" required>
              <select
                required
                value={row.asset}
                onChange={(e) => updateRow(index, { asset: e.target.value })}
                className="ims-input"
              >
                <option value="">— Select —</option>
                {ICT_DEVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Category" required>
              <select
                required
                value={row.category}
                onChange={(e) => updateRow(index, { category: e.target.value })}
                className="ims-input"
              >
                <option value="">— Select —</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Model" required>
              <select
                required
                value={row.model}
                onChange={(e) => updateRow(index, { model: e.target.value })}
                className="ims-input"
              >
                <option value="">— Select —</option>
                {MODEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Serial no." required>
              <input
                type="text"
                required
                value={row.serialNo}
                onChange={(e) => updateRow(index, { serialNo: e.target.value })}
                className="ims-input"
              />
            </FormField>
            <FormField label="Engraved no.">
              <input
                type="text"
                value={row.engravedNo}
                onChange={(e) => updateRow(index, { engravedNo: e.target.value })}
                className="ims-input"
              />
            </FormField>
            <FormField label="Funding source">
              <select
                value={row.funding}
                onChange={(e) => updateRow(index, { funding: e.target.value })}
                className="ims-input"
              >
                <option value="">— Optional —</option>
                {FUNDING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="md:col-span-6 flex justify-end">
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRow(index)}
                  className="ims-btn-secondary text-body-xs"
                >
                  Remove line
                </button>
              )}
            </div>
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={onAddRow}
            className="ims-btn-secondary"
          >
            Add another line
          </button>
        </div>
      </div>
    </FormSectionCollapsible>
  );
}

