/**
 * Ministry of Health Uganda - Institutional Footer Component
 * Professional, minimal footer with institutional information
 */
import React from 'react';
import '../../theme/moh-institutional-theme.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            marginTop: 'var(--space-8)',
            padding: 'var(--space-5) var(--space-6)',
            borderTop: '1px solid var(--color-border-primary)',
            background: 'var(--color-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
        }}>
            <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
            }}>
                © {currentYear} Ministry of Health Uganda. All rights reserved.
            </div>
            
            <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)'
            }}>
                <span>Inventory Management System v2.0.0</span>
                <span style={{ color: 'var(--color-border-primary)' }}>|</span>
                <span>Developed by MoH IT Department</span>
            </div>
        </footer>
    );
};

export default Footer;
