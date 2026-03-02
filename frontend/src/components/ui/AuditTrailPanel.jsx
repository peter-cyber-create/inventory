/**
 * Audit trail side panel for transaction forms.
 * Created, Modified, Approved, Issued, linked records.
 */
export default function AuditTrailPanel({
  createdBy,
  createdAt,
  modifiedBy,
  modifiedAt,
  approvedBy,
  approvedAt,
  issuedBy,
  issuedAt,
  linkedRecords = [],
  className = '',
}) {
  const line = (label, value, sub) => {
    if (value == null && sub == null) return null;
    return (
      <div key={label} className="py-2 border-b border-gov-borderLight last:border-0">
        <span className="text-label text-gov-secondaryMuted uppercase tracking-wide block">{label}</span>
        <span className="text-body text-gov-primary block mt-0.5">{value ?? '—'}</span>
        {sub && <span className="text-body-sm text-gov-secondaryMuted block mt-0.5">{sub}</span>}
      </div>
    );
  };

  const hasContent = createdBy || createdAt || modifiedBy || modifiedAt || approvedBy || approvedAt || issuedBy || issuedAt || (linkedRecords && linkedRecords.length > 0);

  if (!hasContent) return null;

  return (
    <div className={`bg-gov-backgroundAlt border border-gov-border rounded-form px-4 py-3 ${className}`}>
      <h4 className="text-label text-gov-secondaryMuted uppercase tracking-wider mb-3 font-medium">Audit trail</h4>
      {line('Created', createdBy, createdAt ? new Date(createdAt).toLocaleString() : null)}
      {line('Modified', modifiedBy, modifiedAt ? new Date(modifiedAt).toLocaleString() : null)}
      {line('Approved', approvedBy, approvedAt ? new Date(approvedAt).toLocaleString() : null)}
      {line('Issued', issuedBy, issuedAt ? new Date(issuedAt).toLocaleString() : null)}
      {linkedRecords && linkedRecords.length > 0 && (
        <div className="py-2 border-b border-gov-borderLight last:border-0">
          <span className="text-label text-gov-secondaryMuted uppercase tracking-wide block">Linked records</span>
          <ul className="text-body-sm text-gov-primary mt-1 list-disc list-inside">
            {linkedRecords.map((r, i) => (
              <li key={i}>{typeof r === 'string' ? r : r?.label ?? r?.id ?? '—'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
