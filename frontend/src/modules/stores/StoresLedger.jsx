import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StoresLedger() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const load = () => {
    setLoading(true);
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    api.get('/api/stores/ledger', { params }).then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);
  const onFilter = (e) => { e.preventDefault(); load(); };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gov-navy mb-4">Stock Ledger</h1>
      <form onSubmit={onFilter} className="flex flex-wrap gap-2 mb-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" placeholder="From" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" placeholder="To" />
        <button type="submit" className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Filter</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Item</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Balance After</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-2 text-sm">{e.item?.name ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">{e.transactionType}</td>
                  <td className="px-4 py-2 text-sm">{e.quantity}</td>
                  <td className="px-4 py-2 text-sm">{e.balanceAfter}</td>
                  <td className="px-4 py-2 text-sm">{e.transactionDate ? new Date(e.transactionDate).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-4 text-gray-500 text-sm">No ledger entries.</p>}
        </div>
      )}
    </div>
  );
}
