/**
 * Ministry of Health Uganda - Institutional Modal Component
 * Professional modal dialogs for confirmations and forms
 */
import React, { useEffect } from 'react';
import '../../theme/moh-institutional-theme.css';

const InstitutionalModal = ({
    visible,
    onClose,
    title,
    children,
    footer,
    width = 600,
    closable = true
}) => {
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <>
            <div
                className="modal-backdrop"
                onClick={closable ? onClose : undefined}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 'var(--z-modal-backdrop)',
                    cursor: closable ? 'pointer' : 'default'
                }}
            />
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 'var(--z-modal)',
                    width: '90%',
                    maxWidth: `${width}px`,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                {title && (
                    <div className="modal-header" style={{
                        padding: 'var(--space-5)',
                        borderBottom: '1px solid var(--color-border-primary)',
                        background: 'var(--color-bg-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                            margin: 0
                        }}>
                            {title}
                        </h2>
                        {closable && (
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: 'var(--font-size-xl)',
                                    color: 'var(--color-text-tertiary)',
                                    cursor: 'pointer',
                                    padding: 'var(--space-2)',
                                    lineHeight: 1,
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'all var(--transition-base)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'var(--color-surface-hover)';
                                    e.target.style.color = 'var(--color-text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--color-text-tertiary)';
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="modal-body" style={{
                    padding: 'var(--space-5)',
                    flex: 1,
                    overflow: 'auto'
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="modal-footer" style={{
                        padding: 'var(--space-5)',
                        borderTop: '1px solid var(--color-border-primary)',
                        background: 'var(--color-bg-secondary)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--space-3)'
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};

export default InstitutionalModal;

