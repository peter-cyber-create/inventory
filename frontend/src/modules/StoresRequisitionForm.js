import React, { useState } from 'react';

const initialItem = { description: '', unitOfIssue: '', quantityOrdered: '', quantityApproved: '', quantityIssued: '' };
const initialSignature = { role: '', name: '', signedAt: '' };
const signatureRoles = [
  'Requisition Officer',
  'Head of Department/Unit',
  'Approving Officer',
  'Issuing Officer',
  'Receiving Officer'
];

export default function StoresRequisitionForm() {
  const [serialNo, setSerialNo] = useState('');
  const [fromDept, setFromDept] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ ...initialItem }]);
  const [signatures, setSignatures] = useState(signatureRoles.map(role => ({ ...initialSignature, role })));

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { ...initialItem }]);
  const removeItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleSignatureChange = (idx, field, value) => {
    const newSignatures = [...signatures];
    newSignatures[idx][field] = value;
    setSignatures(newSignatures);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      serialNo,
      fromDept,
      date,
      items,
      signatures
    };
    await fetch('/api/stores/requisition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('Requisition submitted!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: 'auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>MINISTRY OF HEALTH</h2>
      <h3 style={{ textAlign: 'center' }}>THE REPUBLIC OF UGANDA</h3>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>STORES REQUISITION/ISSUE VOUCHERS</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <label>Serial No.: <input value={serialNo} onChange={e => setSerialNo(e.target.value)} /></label>
        <label>From Dept/Unit: <input value={fromDept} onChange={e => setFromDept(e.target.value)} /></label>
        <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      </div>
      <p><b>Please supply the following</b></p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Items Description</th>
            <th>Unit of Issue</th>
            <th>Quantity Ordered</th>
            <th>Quantity Approved</th>
            <th>Quantity Issued</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td><input value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} required /></td>
              <td><input value={item.unitOfIssue} onChange={e => handleItemChange(idx, 'unitOfIssue', e.target.value)} required /></td>
              <td><input type="number" value={item.quantityOrdered} onChange={e => handleItemChange(idx, 'quantityOrdered', e.target.value)} required /></td>
              <td><input type="number" value={item.quantityApproved} onChange={e => handleItemChange(idx, 'quantityApproved', e.target.value)} /></td>
              <td><input type="number" value={item.quantityIssued} onChange={e => handleItemChange(idx, 'quantityIssued', e.target.value)} /></td>
              <td>{items.length > 1 && <button type="button" onClick={() => removeItem(idx)}>-</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem} style={{ marginBottom: 24 }}>+ Add Item</button>
      <h3>Signatory Section</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        {signatures.map((sig, idx) => (
          <div key={sig.role} style={{ flex: '1 1 200px', minWidth: 200 }}>
            <label><b>{sig.role}</b><br />
              Name: <input value={sig.name} onChange={e => handleSignatureChange(idx, 'name', e.target.value)} />
              <br />Date: <input type="date" value={sig.signedAt} onChange={e => handleSignatureChange(idx, 'signedAt', e.target.value)} />
            </label>
          </div>
        ))}
      </div>
      <button type="submit">Submit Requisition</button>
    </form>
  );
}
