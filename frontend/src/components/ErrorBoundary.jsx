/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../theme/moh-institutional-theme.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-bg-primary)',
                    padding: 'var(--space-6)'
                }}>
                    <div className="card" style={{
                        maxWidth: '600px',
                        width: '100%',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-surface)',
                        padding: 'var(--space-8)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-4xl)',
                            marginBottom: 'var(--space-4)'
                        }}>
                            ⚠️
                        </div>
                        <h1 style={{
                            fontSize: 'var(--font-size-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--space-4)'
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--space-6)'
                        }}>
                            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--space-4)',
                            justifyContent: 'center'
                        }}>
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="btn btn-primary"
                                style={{
                                    padding: 'var(--space-3) var(--space-6)',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    background: 'var(--moh-primary)',
                                    color: 'var(--color-text-on-primary)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 'var(--font-weight-semibold)'
                                }}
                            >
                                Refresh Page
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/'}
                                className="btn btn-secondary"
                                style={{
                                    padding: 'var(--space-3) var(--space-6)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border-primary)',
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-base)',
                                    fontWeight: 'var(--font-weight-semibold)'
                                }}
                            >
                                Go to Login
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{
                                marginTop: 'var(--space-6)',
                                textAlign: 'left',
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--color-text-tertiary)',
                                background: 'var(--color-bg-secondary)',
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                <summary style={{ cursor: 'pointer', marginBottom: 'var(--space-2)' }}>
                                    Error Details (Development Only)
                                </summary>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

