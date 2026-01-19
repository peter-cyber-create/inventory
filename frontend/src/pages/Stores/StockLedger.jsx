/**
 * Ministry of Health Uganda - Stock Ledger Page
 * Color-coded ledger with improved readability and scanability
 * Red: Opening stock | Green: Received | Black: Issued | Blue: Closing balance
 */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { storesService } from '../../services/storesService';
import InstitutionalTable from '../../components/Common/InstitutionalTable';
import '../../theme/moh-institutional-theme.css';

const StockLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filters, setFilters] = useState({
        item_id: null,
        transaction_type: '',
        date_from: '',
        date_to: ''
    });
    const [summary, setSummary] = useState({
        opening_balance: 0,
        total_received: 0,
        total_issued: 0,
        closing_balance: 0,
        transaction_count: 0
    });

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            loadLedger();
        }
    }, [selectedItem, filters]);

    const loadItems = async () => {
        try {
            const response = await storesService.getItems();
            setItems(response.data?.items || []);
        } catch (error) {
            toast.error('Failed to load items');
        }
    };

    const loadLedger = async () => {
        if (!selectedItem) return;

        setLoading(true);
        try {
            const response = await storesService.getLedger(selectedItem, filters);
            const ledgerData = response.data?.ledger || [];
            
            // Process ledger data with color coding
            const processedData = ledgerData.map((entry, index) => {
                let type = 'opening';
                let color = '#E53935'; // Red for opening
                
                if (entry.type === 'grn' || entry.type === 'received') {
                    type = 'received';
                    color = '#00A968'; // Green for received
                } else if (entry.type === 'issuance' || entry.type === 'issued') {
                    type = 'issued';
                    color = '#1A1A1A'; // Black for issued
                } else if (entry.type === 'closing' || index === ledgerData.length - 1) {
                    type = 'closing';
                    color = '#1976D2'; // Blue for closing
                }

                return {
                    ...entry,
                    displayType: type,
                    displayColor: color
                };
            });

            setTransactions(processedData);

            // Calculate summary
            const opening = processedData.find(e => e.displayType === 'opening')?.opening_balance || 0;
            const received = processedData
                .filter(e => e.displayType === 'received')
                .reduce((sum, e) => sum + (e.received || 0), 0);
            const issued = processedData
                .filter(e => e.displayType === 'issued')
                .reduce((sum, e) => sum + (e.issued || 0), 0);
            const closing = opening + received - issued;

            setSummary({
                opening_balance: opening,
                total_received: received,
                total_issued: issued,
                closing_balance: closing,
                transaction_count: processedData.length
            });
        } catch (error) {
            toast.error('Failed to load ledger');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'displayType',
            label: 'Type',
            render: (value, row) => {
                const typeLabels = {
                    opening: 'Opening Stock',
                    received: 'Received',
                    issued: 'Issued',
                    closing: 'Closing Balance'
                };
                return (
                    <span style={{
                        color: row.displayColor,
                        fontWeight: 'var(--font-weight-semibold)'
                    }}>
                        {typeLabels[value] || value}
                    </span>
                );
            }
        },
        {
            key: 'reference',
            label: 'Reference',
            render: (value) => value || '-'
        },
        {
            key: 'opening_balance',
            label: 'Opening Balance',
            render: (value, row) => row.displayType === 'opening' || row.displayType === 'closing' ? (
                <span style={{ color: row.displayColor, fontWeight: 'var(--font-weight-semibold)' }}>
                    {value || 0}
                </span>
            ) : '-'
        },
        {
            key: 'received',
            label: 'Received',
            render: (value, row) => row.displayType === 'received' ? (
                <span style={{ color: row.displayColor, fontWeight: 'var(--font-weight-semibold)' }}>
                    +{value || 0}
                </span>
            ) : '-'
        },
        {
            key: 'issued',
            label: 'Issued',
            render: (value, row) => row.displayType === 'issued' ? (
                <span style={{ color: row.displayColor, fontWeight: 'var(--font-weight-semibold)' }}>
                    -{value || 0}
                </span>
            ) : '-'
        },
        {
            key: 'closing_balance',
            label: 'Closing Balance',
            render: (value, row) => {
                const balance = value || row.opening_balance + (row.received || 0) - (row.issued || 0);
                return row.displayType === 'closing' || row.displayType === 'opening' ? (
                    <span style={{ color: row.displayColor, fontWeight: 'var(--font-weight-semibold)' }}>
                        {balance}
                    </span>
                ) : balance;
            }
        },
        {
            key: 'remarks',
            label: 'Remarks',
            render: (value) => value || '-'
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
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)'
                }}>
                    Stock Ledger
                </h1>
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    margin: 0
                }}>
                    Real-time stock movements and balances with color-coded entries
                </p>
            </div>

            {/* Filters and Item Selection */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--space-4)'
                    }}>
                        <div className="form-group">
                            <label className="form-label required">Select Item</label>
                            <select
                                className="form-control"
                                value={selectedItem || ''}
                                onChange={(e) => setSelectedItem(e.target.value || null)}
                            >
                                <option value="">-- Select Item --</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.code || item.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Transaction Type</label>
                            <select
                                className="form-control"
                                value={filters.transaction_type}
                                onChange={(e) => setFilters(prev => ({ ...prev, transaction_type: e.target.value }))}
                            >
                                <option value="">All Types</option>
                                <option value="opening">Opening Stock</option>
                                <option value="received">Received</option>
                                <option value="issued">Issued</option>
                                <option value="closing">Closing Balance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date From</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.date_from}
                                onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date To</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.date_to}
                                onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            {selectedItem && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-6)'
                }}>
                    <div className="card" style={{
                        borderLeft: '4px solid #E53935',
                        background: '#FFEBEE'
                    }}>
                        <div className="card-body">
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: '#E53935',
                                fontWeight: 'var(--font-weight-semibold)',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Opening Stock
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: '#E53935'
                            }}>
                                {summary.opening_balance}
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{
                        borderLeft: '4px solid #00A968',
                        background: '#E8F5E8'
                    }}>
                        <div className="card-body">
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: '#00A968',
                                fontWeight: 'var(--font-weight-semibold)',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Total Received
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: '#00A968'
                            }}>
                                +{summary.total_received}
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{
                        borderLeft: '4px solid #1A1A1A',
                        background: '#F5F5F5'
                    }}>
                        <div className="card-body">
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: '#1A1A1A',
                                fontWeight: 'var(--font-weight-semibold)',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Total Issued
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: '#1A1A1A'
                            }}>
                                -{summary.total_issued}
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{
                        borderLeft: '4px solid #1976D2',
                        background: '#E3F2FD'
                    }}>
                        <div className="card-body">
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: '#1976D2',
                                fontWeight: 'var(--font-weight-semibold)',
                                textTransform: 'uppercase',
                                marginBottom: 'var(--space-2)'
                            }}>
                                Closing Balance
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: '#1976D2'
                            }}>
                                {summary.closing_balance}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Color Legend */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <h4 style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-3)'
                    }}>
                        Color Coding Legend
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#E53935',
                                borderRadius: 'var(--radius-sm)'
                            }} />
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>Opening Stock</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#00A968',
                                borderRadius: 'var(--radius-sm)'
                            }} />
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>Received Items</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#1A1A1A',
                                borderRadius: 'var(--radius-sm)'
                            }} />
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>Issued Items</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#1976D2',
                                borderRadius: 'var(--radius-sm)'
                            }} />
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>Closing Balance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            {selectedItem ? (
                <InstitutionalTable
                    data={transactions}
                    columns={columns}
                    loading={loading}
                    sortable={true}
                    filterable={true}
                    pagination={true}
                    pageSize={20}
                    emptyMessage="No ledger entries found for this item"
                />
            ) : (
                <div className="card">
                    <div className="card-body" style={{
                        padding: 'var(--space-8)',
                        textAlign: 'center',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        Please select an item to view its stock ledger
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockLedger;
