import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getToken, getUser } from '../services/auth';
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
