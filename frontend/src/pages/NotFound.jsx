import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      padding: 'var(--space-8)'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--moh-primary)',
          marginBottom: 'var(--space-4)'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-6)',
          lineHeight: 'var(--line-height-relaxed)'
        }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{
              textDecoration: 'none'
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="btn btn-secondary"
            style={{
              textDecoration: 'none'
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;





