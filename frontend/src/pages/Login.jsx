import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { getToken } from '../services/auth';

const REMEMBER_EMAIL_KEY = 'ims_login_email';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already authenticated, go straight to dashboard
    if (getToken()) {
      navigate('/dashboard', { replace: true });
      return;
    }
    // Pre-fill remembered email if present
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const body = { email: email.trim(), password };
      const res = await api.post('/api/auth/login', body);
      const { token, user } = res.data || {};
      if (!token) {
        throw new Error('Login response missing token');
      }
      setAuthToken(token, user || null);
      if (remember) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gov-navy">Government IMS</h1>
          <p className="text-sm text-gov-slate mt-1">Sign in to continue</p>
        </div>
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username / Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gov-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-gov-blue"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs text-gray-600 hover:text-gov-navy"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Remember session</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 px-4 py-2.5 bg-gov-blue text-white rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
