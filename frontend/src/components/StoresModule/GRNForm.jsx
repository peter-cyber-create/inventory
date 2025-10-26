import React, { useState } from 'react';
import Uploader from './Uploader';
import SignaturePad from './SignaturePad';

// GRN (Goods Received Note) Form Component
export const GRNForm = () => {
  const [formData, setFormData] = useState({
    contractNo: '',
    lpoNo: '',
    deliveryNote: '',
    taxInvoice: '',
    grnNo: `GRN-${Date.now()}`, // Auto-generated
    approvalStatus: 'Pending'
  });

  const [rows, setRows] = useState([
    { desc: '', unit: '', ordered: 0, delivered: 0, remarks: '' }
  ]);

  const [uploads, setUploads] = useState([]);
  const [signatures, setSignatures] = useState({
    receiving: null,
    issuing: null,
    approving: null
  });

  const addRow = () => {
    setRows(prev => [...prev, { desc: '', unit: '', ordered: 0, delivered: 0, remarks: '' }]);
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
      uploads: uploads.map(f => ({ name: f.name, size: f.size, type: f.type })),
      signatures: Object.keys(signatures).reduce((acc, key) => {
        acc[key] = signatures[key] ? 'captured' : 'missing';
        return acc;
      }, {})
    };

    console.log('GRN Submission:', payload);
    alert('GRN submitted successfully! Check console for details.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Goods Received Note (GRN)</h2>
        
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Procurement Reference Number
            </label>
            <input
              type="text"
              value={formData.contractNo}
              onChange={(e) => setFormData(prev => ({ ...prev, contractNo: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contract No."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LPO No.
            </label>
            <input
              type="text"
              value={formData.lpoNo}
              onChange={(e) => setFormData(prev => ({ ...prev, lpoNo: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="LPO Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Note No.
            </label>
            <input
              type="text"
              value={formData.deliveryNote}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryNote: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Delivery Note Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Invoice No.
            </label>
            <input
              type="text"
              value={formData.taxInvoice}
              onChange={(e) => setFormData(prev => ({ ...prev, taxInvoice: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tax Invoice Number"
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Qty Delivered</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Remarks</th>
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
                        value={row.delivered}
                        onChange={(e) => updateRow(index, 'delivered', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => updateRow(index, 'remarks', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Remarks"
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

        {/* File Uploads */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
          <p className="text-sm text-gray-600 mb-2">Upload Form 5 and Technical Specifications</p>
          <Uploader 
            onFiles={setUploads} 
            maxSizeMB={200} 
            accept="application/pdf,image/*" 
          />
        </div>

        {/* Signatures */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signatures</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Receiving Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('receiving', dataUrl)} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Issuing Officer</h4>
              <SignaturePad onSave={(dataUrl) => handleSignature('issuing', dataUrl)} />
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
            Submit GRN
          </button>
          <button
            type="button"
            onClick={() => console.log('Form data:', { formData, rows, uploads, signatures })}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Preview Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default GRNForm;
