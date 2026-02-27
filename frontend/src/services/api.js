import axios from 'axios';
import { getToken, setAuth, clearAuth } from './auth.js';

const api = axios.create({
  baseURL: '', // use full paths: /api/...
  headers: { 'Content-Type': 'application/json' },
});

// Apply stored token so requests send Authorization when JWT is enabled on backend
const token = getToken();
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
