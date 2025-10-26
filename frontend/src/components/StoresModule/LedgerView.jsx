import React, { useState, useEffect } from 'react';

// LedgerView component with color-coded entries
export const LedgerView = ({ itemId = 'Demo' }) => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-09-01',
      type: 'opening',
      grnRef: 'OPEN-001',
      issuanceRef: '',
      opening: 100,
      received: 0,
      issued: 0,
      closing: 100,
      remarks: 'Opening stock'
    },
    {
      id: 2,
      date: '2025-09-05',
      type: 'grn',
      grnRef: 'GRN-002',
      issuanceRef: '',
      opening: 100,
      received: 50,
      issued: 0,
      closing: 150,
      remarks: 'Received from supplier'
    },
    {
      id: 3,
      date: '2025-09-10',
      type: 'issuance',
      grnRef: '',
      issuanceRef: 'ISS-003',
      opening: 150,
      received: 0,
      issued: 30,
      closing: 120,
      remarks: 'Issued to department'
    },
    {
      id: 4,
      date: '2025-09-15',
      type: 'grn',
      grnRef: 'GRN-004',
      issuanceRef: '',
      opening: 120,
      received: 25,
      issued: 0,
      closing: 145,
      remarks: 'Additional stock received'
    }
  ]);

  const [showLegend, setShowLegend] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const getRowStyle = (type) => {
    switch (type) {
      case 'opening':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'grn':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'issuance':
        return 'border-l-4 border-black bg-white';
      default:
        return 'border-l-4 border-blue-400 bg-blue-50';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'opening':
        return 'Opening Stock';
      case 'grn':
        return 'Goods Received';
      case 'issuance':
        return 'Issued';
      default:
        return 'Other';
    }
  };

  const filteredEntries = filterType === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === filterType);

  const totalReceived = entries.reduce((sum, entry) => sum + entry.received, 0);
  const totalIssued = entries.reduce((sum, entry) => sum + entry.issued, 0);
  const currentStock = entries[entries.length - 1]?.closing || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Stock Ledger — Item {itemId}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            {showLegend ? 'Hide' : 'Show'} Legend
          </button>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Entries</option>
            <option value="opening">Opening Stock</option>
            <option value="grn">Goods Received</option>
            <option value="issuance">Issued</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-red-500 bg-red-50"></div>
              <span>Opening Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-green-500 bg-green-50"></div>
              <span>Received Items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-black bg-white"></div>
              <span>Issued Items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-blue-400 bg-blue-50"></div>
              <span>Closing Balance</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700">Current Stock</h4>
          <p className="text-2xl font-bold text-blue-900">{currentStock}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-700">Total Received</h4>
          <p className="text-2xl font-bold text-green-900">{totalReceived}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700">Total Issued</h4>
          <p className="text-2xl font-bold text-gray-900">{totalIssued}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-700">Transactions</h4>
          <p className="text-2xl font-bold text-yellow-900">{entries.length}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">GRN Ref</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Issuance Ref</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Opening</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Received</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Issued</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Closing</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className={`${getRowStyle(entry.type)} hover:bg-opacity-80`}>
                <td className="px-4 py-2 border-b text-sm">{entry.date}</td>
                <td className="px-4 py-2 border-b text-sm font-medium">
                  {getTypeLabel(entry.type)}
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  {entry.grnRef || '-'}
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  {entry.issuanceRef || '-'}
                </td>
                <td className="px-4 py-2 border-b text-sm font-mono">
                  {entry.opening}
                </td>
                <td className="px-4 py-2 border-b text-sm font-mono text-green-600">
                  {entry.received > 0 ? `+${entry.received}` : '-'}
                </td>
                <td className="px-4 py-2 border-b text-sm font-mono text-red-600">
                  {entry.issued > 0 ? `-${entry.issued}` : '-'}
                </td>
                <td className="px-4 py-2 border-b text-sm font-mono font-bold text-blue-600">
                  {entry.closing}
                </td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">
                  {entry.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No entries found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default LedgerView;
