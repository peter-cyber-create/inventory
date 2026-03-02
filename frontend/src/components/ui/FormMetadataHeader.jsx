/**
 * Enterprise form metadata header. Use at the top of every major transaction form.
 * Document number, status, creator, department, date, reference, linked transaction.
 */
export default function FormMetadataHeader({
  documentNumber,
  status,
  createdBy,
  department,
  date,
  referenceCode,
  linkedTransaction,
  className = '',
}) {
  const row = (label, value) =>
    value != null && value !== '' ? (
      <div key={label} className="flex flex-col">
        <span className="text-label text-gov-secondaryMuted uppercase tracking-wide">{label}</span>
        <span className="text-body text-gov-primary mt-0.5">{value}</span>
      </div>
    ) : null;

  const items = [
    row('Document Number', documentNumber),
    row('Status', status),
    row('Created By', createdBy),
    row('Department', department),
    row('Date', date),
    row('Reference Code', referenceCode),
    row('Linked Transaction', linkedTransaction),
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className={`bg-gov-backgroundAlt border border-gov-border rounded-form px-4 py-3 mb-6 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {items}
      </div>
    </div>
  );
}
