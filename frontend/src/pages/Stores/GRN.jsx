/**
 * Ministry of Health Uganda - GRN (Goods Received Note) Page
 * Official government format - Professional, institutional design
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { storesService } from '../../services/storesService';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import InstitutionalModal from '../../components/Common/InstitutionalModal';
import StatusBadge from '../../components/Common/StatusBadge';
import '../../theme/moh-institutional-theme.css';

const GRN = () => {
    const [grns, setGrns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGRN, setEditingGRN] = useState(null);
    const [formData, setFormData] = useState({
        contract_no: '',
        lpo_no: '',
        delivery_note: '',
        tax_invoice: '',
        grn_no: '',
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        items: [{ description: '', unit: '', quantity_ordered: 0, quantity_delivered: 0, quantity_accepted: 0, unit_price: 0, remarks: '' }]
    });

    useEffect(() => {
        loadGRNs();
    }, []);

    const loadGRNs = async () => {
        setLoading(true);
        try {
            const response = await storesService.getGRNs();
            console.log('GRN API Response:', response);
            // Handle different response structures
            const grnData = response.data?.data || response.data?.grns || response.data || [];
            setGrns(Array.isArray(grnData) ? grnData : []);
        } catch (error) {
            console.error('Error loading GRNs:', error);
            console.error('Error response:', error.response);
            toast.error(error.response?.data?.message || 'Failed to load GRNs');
            setGrns([]); // Ensure empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', unit: '', quantity_ordered: 0, quantity_delivered: 0, quantity_accepted: 0, unit_price: 0, remarks: '' }]
        }));
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGRN) {
                await storesService.updateGRN(editingGRN.id, formData);
                toast.success('GRN updated successfully');
            } else {
                await storesService.createGRN(formData);
                toast.success('GRN created successfully');
            }
            setModalVisible(false);
            setEditingGRN(null);
            setFormData({
                contract_no: '',
                lpo_no: '',
                delivery_note: '',
                tax_invoice: '',
                grn_no: '',
                date: new Date().toISOString().split('T')[0],
                supplier: '',
                items: [{ description: '', unit: '', quantity_ordered: 0, quantity_delivered: 0, quantity_accepted: 0, unit_price: 0, remarks: '' }]
            });
            loadGRNs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save GRN');
        }
    };

    const handleEdit = (grn) => {
        setEditingGRN(grn);
        setFormData({
            contract_no: grn.contract_no || '',
            lpo_no: grn.lpo_no || '',
            delivery_note: grn.delivery_note || '',
            tax_invoice: grn.tax_invoice || '',
            grn_no: grn.grn_no || '',
            date: grn.date || new Date().toISOString().split('T')[0],
            supplier: grn.supplier || '',
            items: grn.items || [{ description: '', unit: '', quantity_ordered: 0, quantity_delivered: 0, quantity_accepted: 0, unit_price: 0, remarks: '' }]
        });
        setModalVisible(true);
    };

    const columns = [
        {
            key: 'grn_no',
            label: 'GRN Number',
            sortable: true
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'contract_no',
            label: 'Contract No.',
            sortable: true
        },
        {
            key: 'lpo_no',
            label: 'LPO No.',
            sortable: true
        },
        {
            key: 'supplier',
            label: 'Supplier',
            sortable: true
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <StatusBadge type={value === 'approved' ? 'success' : value === 'pending' ? 'warning' : 'neutral'}>{value}</StatusBadge>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => window.print()}
                    >
                        Print
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            {/* Uganda Flag Stripe */}
            <div style={{
                height: '6px',
                background: 'linear-gradient(to right, var(--uganda-black) 0%, var(--uganda-black) 33.33%, var(--uganda-yellow) 33.33%, var(--uganda-yellow) 66.66%, var(--uganda-red) 66.66%, var(--uganda-red) 100%)',
                marginBottom: 'var(--space-6)'
            }} />

            {/* Page Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-6)'
            }}>
                <div>
                    <h1 style={{
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)'
                    }}>
                        Goods Received Note (GRN)
                    </h1>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                    }}>
                        Official government format for recording received goods
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingGRN(null);
                        setFormData({
                            contract_no: '',
                            lpo_no: '',
                            delivery_note: '',
                            tax_invoice: '',
                            grn_no: '',
                            date: new Date().toISOString().split('T')[0],
                            supplier: '',
                            items: [{ description: '', unit: '', quantity_ordered: 0, quantity_delivered: 0, quantity_accepted: 0, unit_price: 0, remarks: '' }]
                        });
                        setModalVisible(true);
                    }}
                >
                    + Create GRN
                </button>
            </div>

            {/* GRN List Table */}
            <InstitutionalTable
                data={grns}
                columns={columns}
                loading={loading}
                sortable={true}
                filterable={true}
                pagination={true}
                pageSize={10}
                emptyMessage="No GRNs found. Create your first GRN to get started."
            />

            {/* GRN Form Modal */}
            <InstitutionalModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingGRN(null);
                }}
                title={editingGRN ? 'Edit GRN' : 'Create New GRN'}
                width={1000}
            >
                <form onSubmit={handleSubmit}>
                    {/* Official GRN Header Section */}
                    <div className="card" style={{
                        marginBottom: 'var(--space-6)',
                        border: '2px solid var(--color-border-primary)'
                    }}>
                        <div style={{
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-secondary)',
                            borderBottom: '1px solid var(--color-border-primary)'
                        }}>
                            <h3 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--moh-primary)',
                                margin: 0,
                                textAlign: 'center'
                            }}>
                                THE REPUBLIC OF UGANDA<br />
                                MINISTRY OF HEALTH<br />
                                GOODS RECEIVED NOTE (GRN)
                            </h3>
                        </div>

                        <div className="card-body">
                            {/* Header Fields */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 'var(--space-4)',
                                marginBottom: 'var(--space-5)'
                            }}>
                                <div className="form-group">
                                    <label className="form-label required">Contract No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.contract_no}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contract_no: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">LPO No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.lpo_no}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lpo_no: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Delivery Note No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.delivery_note}
                                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_note: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Tax Invoice No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.tax_invoice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tax_invoice: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GRN No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.grn_no}
                                        onChange={(e) => setFormData(prev => ({ ...prev, grn_no: e.target.value }))}
                                        placeholder="Auto-generated"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Supplier</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--space-3)'
                                }}>
                                    <h4 style={{
                                        fontSize: 'var(--font-size-base)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        margin: 0
                                    }}>
                                        Items Received
                                    </h4>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleAddItem}
                                    >
                                        + Add Item
                                    </button>
                                </div>

                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40px' }}>No.</th>
                                                <th>Description</th>
                                                <th style={{ width: '100px' }}>Unit</th>
                                                <th style={{ width: '100px' }}>Qty Ordered</th>
                                                <th style={{ width: '100px' }}>Qty Delivered</th>
                                                <th style={{ width: '100px' }}>Qty Accepted</th>
                                                <th style={{ width: '120px' }}>Unit Price</th>
                                                <th>Remarks</th>
                                                <th style={{ width: '60px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.description}
                                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                            style={{ minWidth: '200px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.unit}
                                                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.quantity_ordered}
                                                            onChange={(e) => handleItemChange(index, 'quantity_ordered', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.quantity_delivered}
                                                            onChange={(e) => handleItemChange(index, 'quantity_delivered', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.quantity_accepted}
                                                            onChange={(e) => handleItemChange(index, 'quantity_accepted', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.unit_price}
                                                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.remarks}
                                                            onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {formData.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() => handleRemoveItem(index)}
                                                                style={{ color: 'var(--color-error)' }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--space-3)'
                    }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setModalVisible(false);
                                setEditingGRN(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {editingGRN ? 'Update GRN' : 'Create GRN'}
                        </button>
                    </div>
                </form>
            </InstitutionalModal>
        </div>
    );
};

export default GRN;
