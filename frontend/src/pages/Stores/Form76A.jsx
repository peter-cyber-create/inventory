/**
 * Ministry of Health Uganda - Form 76A (Requisition/Issue Voucher) Page
 * Official government format - Professional, institutional design
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { storesService } from '../../services/storesService';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import InstitutionalModal from '../../components/Common/InstitutionalModal';
import StatusBadge from '../../components/Common/StatusBadge';
import '../../theme/moh-institutional-theme.css';

const Form76A = () => {
    const [form76aList, setForm76aList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [formData, setFormData] = useState({
        serial_no: '',
        date: new Date().toISOString().split('T')[0],
        country: 'The Republic of Uganda',
        ministry: 'Ministry of Health',
        from_department: '',
        to_store: '',
        purpose_remarks: '',
        items: [{
            description: '',
            unit: '',
            quantity_ordered: 0,
            quantity_approved: 0,
            quantity_issued: 0
        }]
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchForm76AList();
    }, [pagination.current]);

    const fetchForm76AList = async () => {
        setLoading(true);
        try {
            const response = await storesService.getForm76AList({
                page: pagination.current,
                limit: pagination.pageSize
            });
            if (response.data?.success) {
                setForm76aList(response.data.data?.requisitions || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.data?.pagination?.total || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching Form 76A:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch Form 76A list');
            setForm76aList([]); // Ensure empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedForm(null);
        setFormData({
            serial_no: `REQ-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            country: 'The Republic of Uganda',
            ministry: 'Ministry of Health',
            from_department: '',
            to_store: '',
            purpose_remarks: '',
            items: [{
                description: '',
                unit: '',
                quantity_ordered: 0,
                quantity_approved: 0,
                quantity_issued: 0
            }]
        });
        setModalVisible(true);
    };

    const handleEdit = async (record) => {
        try {
            const response = await storesService.getForm76A(record.requisition_id);
            if (response.data?.success) {
                const data = response.data.data;
                setSelectedForm(data);
                setFormData({
                    serial_no: data.requisition_number || `REQ-${Date.now()}`,
                    date: data.form_date || new Date().toISOString().split('T')[0],
                    country: 'The Republic of Uganda',
                    ministry: 'Ministry of Health',
                    from_department: data.from_department || '',
                    to_store: data.to_department || '',
                    purpose_remarks: data.purpose_remarks || '',
                    items: data.items?.map(item => ({
                        description: item.description || '',
                        unit: item.unit || '',
                        quantity_ordered: item.qty_ordered || 0,
                        quantity_approved: item.qty_approved || 0,
                        quantity_issued: item.qty_issued || 0
                    })) || [{
                        description: '',
                        unit: '',
                        quantity_ordered: 0,
                        quantity_approved: 0,
                        quantity_issued: 0
                    }]
                });
                setModalVisible(true);
            }
        } catch (error) {
            toast.error('Failed to load Form 76A');
        }
    };

    const handleView = async (record) => {
        try {
            const response = await storesService.getForm76A(record.requisition_id);
            if (response.data?.success) {
                setSelectedForm(response.data.data);
                setViewModalVisible(true);
            }
        } catch (error) {
            toast.error('Failed to load Form 76A details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.items.length === 0) {
                toast.error('Please add at least one item');
                return;
            }

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            const submitData = {
                requisition_number: formData.serial_no,
                form_date: formData.date,
                from_department: formData.from_department,
                to_department: formData.to_store,
                purpose_remarks: formData.purpose_remarks,
                requested_by: user?.id || null,
                department_id: user?.department_id || null,
                status: 'draft',
                items: formData.items.map(item => ({
                    description: item.description,
                    unit: item.unit,
                    qty_ordered: item.quantity_ordered,
                    qty_approved: item.quantity_approved,
                    qty_issued: item.quantity_issued
                }))
            };

            let response;
            if (selectedForm) {
                response = await storesService.updateForm76A(selectedForm.requisition_id, submitData);
            } else {
                response = await storesService.createForm76A(submitData);
            }

            if (response.data?.success) {
                toast.success(`Form 76A ${selectedForm ? 'updated' : 'created'} successfully`);
                setModalVisible(false);
                setSelectedForm(null);
                fetchForm76AList();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save Form 76A');
        }
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                description: '',
                unit: '',
                quantity_ordered: 0,
                quantity_approved: 0,
                quantity_issued: 0
            }]
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

    const columns = [
        {
            key: 'requisition_number',
            label: 'Serial No.',
            sortable: true
        },
        {
            key: 'form_date',
            label: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'from_department',
            label: 'From Department',
            sortable: true
        },
        {
            key: 'to_department',
            label: 'To Store',
            sortable: true
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const statusMap = {
                    'draft': 'neutral',
                    'submitted': 'info',
                    'printed': 'success',
                    'approved': 'success',
                    'rejected': 'error'
                };
                return <StatusBadge type={statusMap[value] || 'neutral'}>{value}</StatusBadge>;
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleView(row)}
                    >
                        View
                    </button>
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
                        Form 76A - Requisition/Issue Voucher
                    </h1>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                    }}>
                        Official Uganda government requisition format
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreate}
                >
                    + Create Form 76A
                </button>
            </div>

            {/* Form 76A List Table */}
            <InstitutionalTable
                data={form76aList}
                columns={columns}
                loading={loading}
                sortable={true}
                filterable={true}
                pagination={true}
                pageSize={10}
                emptyMessage="No Form 76A requisitions found. Create your first requisition to get started."
            />

            {/* Form 76A Creation/Edit Modal */}
            <InstitutionalModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedForm(null);
                }}
                title={selectedForm ? 'Edit Form 76A' : 'Create Form 76A'}
                width={1100}
            >
                <form onSubmit={handleSubmit}>
                    {/* Official Form 76A Header */}
                    <div className="card" style={{
                        marginBottom: 'var(--space-6)',
                        border: '2px solid var(--color-border-primary)'
                    }}>
                        <div style={{
                            padding: 'var(--space-5)',
                            background: 'var(--color-bg-secondary)',
                            borderBottom: '2px solid var(--moh-primary)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--moh-primary)',
                                margin: 0,
                                marginBottom: 'var(--space-2)'
                            }}>
                                {formData.country}
                            </h3>
                            <h4 style={{
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)',
                                margin: 0,
                                marginBottom: 'var(--space-2)'
                            }}>
                                {formData.ministry}
                            </h4>
                            <h5 style={{
                                fontSize: 'var(--font-size-base)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-secondary)',
                                margin: 0
                            }}>
                                REQUISITION/ISSUE VOUCHER (FORM 76A)
                            </h5>
                        </div>

                        <div className="card-body">
                            {/* Header Fields */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--space-4)',
                                marginBottom: 'var(--space-5)'
                            }}>
                                <div className="form-group">
                                    <label className="form-label">Serial No.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.serial_no}
                                        onChange={(e) => setFormData(prev => ({ ...prev, serial_no: e.target.value }))}
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
                                <div className="form-group">
                                    <label className="form-label">Reference</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Optional reference"
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label required">From Department/Unit</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.from_department}
                                        onChange={(e) => setFormData(prev => ({ ...prev, from_department: e.target.value }))}
                                        placeholder="e.g., Pharmacy, Laboratory, etc."
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label required">To (Store/Receiving Section)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.to_store}
                                        onChange={(e) => setFormData(prev => ({ ...prev, to_store: e.target.value }))}
                                        placeholder="e.g., Main Store, Receiving Section"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label required">Purpose / Remarks</label>
                                    <textarea
                                        className="form-control"
                                        value={formData.purpose_remarks}
                                        onChange={(e) => setFormData(prev => ({ ...prev, purpose_remarks: e.target.value }))}
                                        rows={3}
                                        placeholder="Enter purpose or remarks for this requisition"
                                        required
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
                                        Items Requisitioned
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
                                                <th style={{ width: '50px' }}>No.</th>
                                                <th>Description</th>
                                                <th style={{ width: '100px' }}>Unit</th>
                                                <th style={{ width: '100px' }}>Qty Ordered</th>
                                                <th style={{ width: '100px' }}>Qty Approved</th>
                                                <th style={{ width: '100px' }}>Qty Issued</th>
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
                                                            style={{ minWidth: '250px' }}
                                                            required
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
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.quantity_approved}
                                                            onChange={(e) => handleItemChange(index, 'quantity_approved', parseFloat(e.target.value) || 0)}
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.quantity_issued}
                                                            onChange={(e) => handleItemChange(index, 'quantity_issued', parseFloat(e.target.value) || 0)}
                                                            min="0"
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

                            {/* Signature Areas */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 'var(--space-4)',
                                marginTop: 'var(--space-6)',
                                paddingTop: 'var(--space-4)',
                                borderTop: '1px solid var(--color-border-primary)'
                            }}>
                                <div>
                                    <label className="form-label">Requisitioning Officer</label>
                                    <div style={{
                                        height: '60px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--color-text-tertiary)'
                                    }}>
                                        Signature
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Issuing Officer</label>
                                    <div style={{
                                        height: '60px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--color-text-tertiary)'
                                    }}>
                                        Signature
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Receiving Officer</label>
                                    <div style={{
                                        height: '60px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--color-text-tertiary)'
                                    }}>
                                        Signature
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Head of Department</label>
                                    <div style={{
                                        height: '60px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--color-text-tertiary)'
                                    }}>
                                        Signature
                                    </div>
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
                                setSelectedForm(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {selectedForm ? 'Update Form 76A' : 'Create Form 76A'}
                        </button>
                    </div>
                </form>
            </InstitutionalModal>

            {/* View Modal */}
            <InstitutionalModal
                visible={viewModalVisible}
                onClose={() => setViewModalVisible(false)}
                title="View Form 76A"
                width={1100}
            >
                {selectedForm && (
                    <div>
                        <div className="card">
                            <div className="card-body">
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 'var(--space-4)',
                                    marginBottom: 'var(--space-4)'
                                }}>
                                    <div>
                                        <strong>Serial No.:</strong> {selectedForm.requisition_number}
                                    </div>
                                    <div>
                                        <strong>Date:</strong> {new Date(selectedForm.form_date).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>From Department:</strong> {selectedForm.from_department}
                                    </div>
                                    <div>
                                        <strong>To Store:</strong> {selectedForm.to_department}
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <strong>Purpose/Remarks:</strong> {selectedForm.purpose_remarks}
                                    </div>
                                </div>
                                {selectedForm.items && selectedForm.items.length > 0 && (
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Description</th>
                                                    <th>Unit</th>
                                                    <th>Qty Ordered</th>
                                                    <th>Qty Approved</th>
                                                    <th>Qty Issued</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedForm.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.qty_ordered}</td>
                                                        <td>{item.qty_approved}</td>
                                                        <td>{item.qty_issued}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </InstitutionalModal>
        </div>
    );
};

export default Form76A;
