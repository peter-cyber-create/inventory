import { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getToken, getUser, clearAuth } from '../services/auth';
import api from '../services/api';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const PATH_MODULES = {
  '/ict': 'ICT',
  '/fleet': 'Fleet',
  '/stores': 'Stores',
  '/finance': 'Finance',
  '/admin': 'Admin',
};

function canAccessPath(pathname, userModule) {
  if (!pathname || pathname === '/' || pathname === '/dashboard') return true;
  const module = (userModule || '').trim();
  if (!module || module === 'All' || module === 'All modules') return true;
  for (const [prefix, mod] of Object.entries(PATH_MODULES)) {
    if (pathname.startsWith(prefix)) return mod === module;
  }
  return true;
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    const user = getUser();
    if (!canAccessPath(location.pathname, user?.module)) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate, location.pathname]);

  // Load session timeout (in minutes) from System Settings key "session_timeout_minutes"
  useEffect(() => {
    let cancelled = false;
    api
      .get('/api/admin/settings/key/session_timeout_minutes')
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.settingValue ?? res.data?.value ?? res.data;
        const m = parseInt(String(raw || ''), 10);
        if (!Number.isNaN(m) && m > 0) setSessionTimeoutMinutes(m);
      })
      .catch(() => {
        // ignore, fallback to JWT expiry behaviour
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Track user activity and auto-logout after configured idle time
  useEffect(() => {
    if (!sessionTimeoutMinutes) return;
    const timeoutMs = sessionTimeoutMinutes * 60 * 1000;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    const interval = setInterval(() => {
      if (!getToken()) return;
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor > timeoutMs) {
        clearInterval(interval);
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('click', updateActivity);
        clearAuth();
        navigate('/login?session=idle', { replace: true });
      }
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, [sessionTimeoutMinutes, navigate]);

  if (!token) return null;

  return (
    <div className="h-screen flex flex-col bg-gov-background overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
