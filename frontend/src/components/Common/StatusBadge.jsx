/**
 * Ministry of Health Uganda - Status Badge Component
 * Professional status indicators for approvals, states, etc.
 */
import React from 'react';
import '../../theme/moh-institutional-theme.css';

const StatusBadge = ({
    status,
    type = 'neutral',
    children
}) => {
    const statusConfig = {
        success: {
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            label: 'Approved'
        },
        warning: {
            background: 'var(--color-warning-bg)',
            color: 'var(--color-warning)',
            label: 'Pending'
        },
        error: {
            background: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            label: 'Rejected'
        },
        info: {
            background: 'var(--color-info-bg)',
            color: 'var(--color-info)',
            label: 'In Progress'
        },
        neutral: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-secondary)',
            label: 'Draft'
        }
    };

    const config = statusConfig[type] || statusConfig.neutral;
    const displayText = children || status || config.label;

    return (
        <span className="badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: 'var(--space-1) var(--space-2)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            borderRadius: 'var(--radius-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: config.background,
            color: config.color,
            border: 'none'
        }}>
            {displayText}
        </span>
    );
};

export default StatusBadge;

