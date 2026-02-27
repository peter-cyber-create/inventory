import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function StoresLedger() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/stores/ledger').then((res) => setList(res.data)).catch(() => setList([])).finally(() => setLoading(false));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gov-navy mb-6">Stock Ledger</h1>
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
                  <td className="px-4 py-2 text-sm">{e.movementType}</td>
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
