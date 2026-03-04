export default function StatusChip({ status }) {
  const s = (status || 'draft').toLowerCase();
  const map = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-emerald-100 text-emerald-700',
    open: 'bg-blue-100 text-blue-700',
    closed: 'bg-gray-300 text-gray-800',
  };
  const cls = map[s] || map.draft;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status || 'Draft'}
    </span>
  );
}

