import React, { useState } from 'react';
import SignaturePad from './SignaturePad';

// Issuance (Requisition/Issue Voucher) Form Component
export const IssuanceForm = () => {
  const [formData, setFormData] = useState({
    country: 'The Republic of Uganda',
    ministry: 'Ministry of Health',
    fromDept: '',
    serialNo: `ISS-${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  });

  const [rows, setRows] = useState([
    { desc: '', unit: '', ordered: 0, approved: 0, issued: 0 }
  ]);

  const [signatures, setSignatures] = useState({
    requisition: null,
    issuing: null,
    receiving: null,
    headOfDept: null,
    approving: null
  });

  const addRow = () => {
    setRows(prev => [...prev, { desc: '', unit: '', ordered: 0, approved: 0, issued: 0 }]);
  };

  const updateRow = (index, field, value) => {
    setRows(prev => prev.map((row, idx) => 
      idx === index ? { ...row, [field]: value } : row
    ));
  };

  const removeRow = (index) => {
    setRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSignature = (type, dataUrl) => {
    setSignatures(prev => ({ ...prev, [type]: dataUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      items: rows,
      signatures: Object.keys(signatures).reduce((acc, key) => {
        acc[key] = signatures[key] ? 'captured' : 'missing';
        return acc;
      }, {})
    };

    console.log('Issuance Submission:', payload);
    alert('Issuance submitted successfully! Check console for details.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Stores Requisition / Issue Voucher
        </h2>
        
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ministry/Department
            </label>
            <input
              type="text"
              value={formData.ministry}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Dept/Unit
            </label>
            <input
              type="text"
              value={formData.fromDept}
              onChange={(e) => setFormData(prev => ({ ...prev, fromDept: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter department/unit name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serial No.
            </label>
            <input
              type="text"
              value={formData.serialNo}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Item No.</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Unit</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Qty Ordered</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Qty Approved</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Qty Issued</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="text"
                        value={row.desc}
                        onChange={(e) => updateRow(index, 'desc', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(e) => updateRow(index, 'unit', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Unit"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.ordered}
                        onChange={(e) => updateRow(index, 'ordered', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.approved}
                        onChange={(e) => updateRow(index, 'approved', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded"
                        min="0"
                        max={row.ordered}
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={row.issued}
                        onChange={(e) => updateRow(index, 'issued', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded"
                        min="0"
                        max={row.approved}
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => removeRow(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        disabled={rows.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addRow}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Item
          </button>
        </div>

        {/* Signatures */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval & Signatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Requisition Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('requisition', dataUrl)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Issuing Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('issuing', dataUrl)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Receiving Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('receiving', dataUrl)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Head of Department/Unit</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('headOfDept', dataUrl)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Approving Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('approving', dataUrl)} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Issuance
          </button>
          <button
            type="button"
            onClick={() => console.log('Form data:', { formData, rows, signatures })}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Preview Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssuanceForm;
