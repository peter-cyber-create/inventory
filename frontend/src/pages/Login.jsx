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
    <div className="min-h-screen flex items-center justify-center bg-gov-background px-4">
      <div className="w-full max-w-md ims-card p-8 border-gov-border">
        <div className="mb-6">
          <h1 className="text-page-title text-gov-primary font-semibold">Ministry of Health</h1>
          <p className="text-body text-gov-secondaryMuted mt-1">IMS — Sign in to continue</p>
          {typeof __BUILD_TIME__ !== 'undefined' && (
            <p className="text-label text-gov-secondaryMuted mt-1">Build: {new Date(__BUILD_TIME__).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</p>
          )}
        </div>
        {error && <p className="mb-4 text-body-sm text-gov-danger">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="ims-label ims-label-required">Username / Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="ims-input"
              required
            />
          </div>
          <div>
            <label className="ims-label ims-label-required">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="ims-input pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-label text-gov-secondary hover:text-gov-primary"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-gov-border text-gov-accent focus:ring-gov-accent"
            />
            <label htmlFor="remember" className="text-body text-gov-secondary">Remember session</label>
          </div>
          <button type="submit" disabled={submitting} className="w-full ims-btn-primary py-2.5">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
