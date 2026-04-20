import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { getToken } from '../services/auth';

const REMEMBER_EMAIL_KEY = 'ims_login_email';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [capsOn, setCapsOn] = useState(false);

  const sessionExpired = searchParams.get('session') === 'expired';

  useEffect(() => {
    if (getToken()) {
      navigate('/dashboard', { replace: true });
      return;
    }
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (sessionExpired) {
      setError('Session expired. Please sign in again.');
      setSearchParams({}, { replace: true });
    }
  }, [sessionExpired, setSearchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const body = { email: email.trim(), password };
      const res = await api.post('/api/auth/login', body);
      const { token, user } = res.data || {};
      if (!token) throw new Error('Login response missing token');
      setAuthToken(token, user || null);
      if (remember) localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      else localStorage.removeItem(REMEMBER_EMAIL_KEY);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gov-login-page">
      <div className="w-full max-w-lg">
        <div
          className="gov-login-card"
        >
          <div className="mb-10">
            <p className="text-label text-gov-secondaryMuted uppercase tracking-[0.22em] text-center">
              REPUBLIC OF UGANDA
            </p>
            <h1 className="mt-2 text-heading text-gov-primary font-semibold text-center">
              Ministry of Health
            </h1>
            <p className="mt-1 text-body text-gov-secondary text-center">
              Inventory Management System
            </p>
          </div>

          {error && (
            <p className="mb-4 text-body-sm text-gov-danger gov-login-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gov-secondaryMuted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  className="peer ims-input pl-9 pt-6 pb-2 text-body-sm placeholder-transparent"
                  placeholder="Username or email"
                />
                <label className="pointer-events-none absolute left-9 top-2.5 origin-left transform text-[0.75rem] text-gov-secondaryMuted tracking-[0.14em] uppercase transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[0.8rem] peer-focus:top-1.5 peer-focus:text-[0.7rem] peer-focus:text-gov-primary">
                  Username / Email
                  <span className="text-gov-danger ml-0.5">*</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gov-secondaryMuted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 8V6a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1Zm2-2a3 3 0 0 1 6 0v2H7V6Zm3 4a2 2 0 0 0-1 3.732V15a1 1 0 1 0 2 0v-1.268A2 2 0 0 0 10 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  onKeyUp={(e) => {
                    if (typeof e.getModifierState === 'function') {
                      setCapsOn(e.getModifierState('CapsLock'));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (typeof e.getModifierState === 'function') {
                      setCapsOn(e.getModifierState('CapsLock'));
                    }
                  }}
                  required
                  className="peer ims-input pl-9 pr-20 pt-6 pb-2 text-body-sm placeholder-transparent"
                  placeholder="Password"
                />
                <label className="pointer-events-none absolute left-9 top-2.5 origin-left transform text-[0.75rem] text-gov-secondaryMuted tracking-[0.14em] uppercase transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[0.8rem] peer-focus:top-1.5 peer-focus:text-[0.7rem] peer-focus:text-gov-primary">
                  Password
                  <span className="text-gov-danger ml-0.5">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.75rem] text-gov-secondary hover:text-gov-primary"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {capsOn && (
                <p className="mt-1 text-body-xs text-gov-warning">
                  Caps Lock is on.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gov-border bg-white text-gov-accent focus:ring-gov-accent"
                />
                <label htmlFor="remember" className="text-body-sm text-gov-secondary">
                  Remember this device
                </label>
              </div>
              <span className="text-[0.7rem] text-gov-secondaryMuted">
                {/* Reserved for future MFA / recovery controls */}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="gov-login-button"
            >
              {submitting && (
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <span className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                </span>
              )}
              <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
            </button>
          </form>

          <div className="mt-8">
            {typeof __BUILD_TIME__ !== 'undefined' && (
              <p className="text-[0.75rem] text-gov-secondaryMuted">
                Build:{' '}
                {new Date(__BUILD_TIME__).toLocaleString('en-GB', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-gov-secondaryMuted">
              <span>
                Version{' '}
                {typeof __BUILD_TIME__ !== 'undefined'
                  ? new Date(__BUILD_TIME__).getFullYear()
                  : '2026'}
              </span>
              <span>© 2026 Ministry of Health – Government of Uganda</span>
            </div>
            <p className="mt-2 text-[0.7rem] text-gov-secondaryMuted">
              Authorized personnel only – access monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
