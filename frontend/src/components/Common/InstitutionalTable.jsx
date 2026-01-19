/**
 * Ministry of Health Uganda - Institutional Data Table Component
 * Dense, functional, sortable, filterable table for government data
 */
import React, { useState, useMemo } from 'react';
import '../../theme/moh-institutional-theme.css';

const InstitutionalTable = ({
    data = [],
    columns = [],
    loading = false,
    onRowClick,
    sortable = true,
    filterable = false,
    pagination = true,
    pageSize = 10,
    emptyMessage = 'No data available'
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortable) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortConfig.direction === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        });
    }, [data, sortConfig, sortable]);

    // Filtering
    const filteredData = useMemo(() => {
        if (!filterable || Object.keys(filters).length === 0) return sortedData;

        return sortedData.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const cellValue = row[key]?.toString().toLowerCase() || '';
                return cellValue.includes(value.toLowerCase());
            });
        });
    }, [sortedData, filters, filterable]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!pagination) return filteredData;
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="table-container" style={{
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-tertiary)'
            }}>
                Loading...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="table-container" style={{
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--color-text-tertiary)'
            }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="table-container">
            {/* Filters */}
            {filterable && (
                <div style={{
                    padding: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-border-primary)',
                    background: 'var(--color-bg-secondary)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap'
                }}>
                    {columns.filter(col => col.filterable !== false).map(column => (
                        <input
                            key={column.key}
                            type="text"
                            placeholder={`Filter ${column.label}...`}
                            value={filters[column.key] || ''}
                            onChange={(e) => handleFilter(column.key, e.target.value)}
                            className="form-control"
                            style={{
                                minWidth: '150px',
                                flex: '1 1 200px'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                    style={{
                                        cursor: column.sortable !== false && sortable ? 'pointer' : 'default',
                                        userSelect: 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)'
                                    }}>
                                        {column.label}
                                        {sortable && column.sortable !== false && sortConfig.key === column.key && (
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)',
                                                color: 'var(--moh-primary)'
                                            }}>
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr
                                key={row.id || index}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    cursor: onRowClick ? 'pointer' : 'default'
                                }}
                            >
                                {columns.map(column => (
                                    <td key={column.key}>
                                        {column.render
                                            ? column.render(row[column.key], row, index)
                                            : row[column.key]?.toString() || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div style={{
                    padding: 'var(--space-4)',
                    borderTop: '1px solid var(--color-border-primary)',
                    background: 'var(--color-bg-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)'
                }}>
                    <div style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-2)',
                        alignItems: 'center'
                    }}>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <div style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            padding: '0 var(--space-3)'
                        }}>
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstitutionalTable;

