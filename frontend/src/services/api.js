import axios from 'axios';
import { getToken, setAuth, clearAuth } from './auth.js';

const api = axios.create({
  baseURL: '', // use full paths: /api/...
  headers: { 'Content-Type': 'application/json' },
});

// Attach current token to every request (so token is never stale after login)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear session and redirect to login so user can sign in again
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
      delete api.defaults.headers.common['Authorization'];
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.replace('/login?session=expired');
      }
    }
    return Promise.reject(err);
  }
);

export function setAuthToken(token, user) {
  setAuth(token, user ?? null);
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export function clearAuthToken() {
  clearAuth();
  delete api.defaults.headers.common['Authorization'];
}

export function setUserHeader(userId) {
  api.defaults.headers.common['X-User-Id'] = userId;
}

export default api;
