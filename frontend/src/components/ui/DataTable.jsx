export default function DataTable({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records.',
  loading = false,
  searchSlot,
  paginationSlot,
  className = '',
}) {
  const rows = Array.isArray(data) ? data : [];
  return (
    <div className={`ims-card overflow-hidden ${className}`}>
      {searchSlot && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-b border-gov-borderLight bg-gov-backgroundAlt/50">
          {searchSlot}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gov-border">
          <thead className="ims-table-header">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-label text-gov-secondary uppercase tracking-wider whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gov-surface divide-y divide-gov-borderLight">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-body-sm text-gov-secondaryMuted">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-gov-border border-t-gov-accent animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-body-sm text-gov-secondaryMuted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row[keyField]}
                  className="ims-table-row"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-body text-gov-primary align-middle">
                      {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {paginationSlot && (
        <div className="flex justify-end px-5 py-3 border-t border-gov-borderLight">
          {paginationSlot}
        </div>
      )}
    </div>
  );
}
