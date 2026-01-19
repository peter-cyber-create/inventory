/**
 * Ministry of Health Uganda - Institutional Form Component
 * Professional, sectioned forms with inline validation
 */
import React from 'react';
import '../../theme/moh-institutional-theme.css';

const InstitutionalForm = ({
    children,
    onSubmit,
    title,
    sections = [],
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    onCancel,
    loading = false
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {title && (
                <div className="card-header">
                    <h2 style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        margin: 0
                    }}>
                        {title}
                    </h2>
                </div>
            )}

            <div className="card-body">
                {sections.length > 0 ? (
                    sections.map((section, index) => (
                        <div key={index} style={{
                            marginBottom: index < sections.length - 1 ? 'var(--space-8)' : 0,
                            paddingBottom: index < sections.length - 1 ? 'var(--space-6)' : 0,
                            borderBottom: index < sections.length - 1 ? '1px solid var(--color-border-primary)' : 'none'
                        }}>
                            {section.title && (
                                <h3 style={{
                                    fontSize: 'var(--font-size-lg)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--moh-primary)',
                                    marginBottom: 'var(--space-4)',
                                    paddingBottom: 'var(--space-2)',
                                    borderBottom: '2px solid var(--color-success-bg)'
                                }}>
                                    {section.title}
                                </h3>
                            )}
                            {section.description && (
                                <p style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--space-4)'
                                }}>
                                    {section.description}
                                </p>
                            )}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: 'var(--space-4)'
                            }}>
                                {section.fields}
                            </div>
                        </div>
                    ))
                ) : (
                    children
                )}
            </div>

            {(onSubmit || onCancel) && (
                <div className="card-footer" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-3)'
                }}>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {cancelLabel}
                        </button>
                    )}
                    {onSubmit && (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : submitLabel}
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default InstitutionalForm;

