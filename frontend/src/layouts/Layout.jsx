import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getToken, getUser } from '../services/auth';
import api, { clearAuthToken } from '../services/api';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  {
    label: 'ICT Assets',
    children: [
      { to: '/ict/assets', label: 'Assets Inventory' },
      { to: '/ict/maintenance', label: 'Maintenance' },
      { to: '/ict/requisitions', label: 'Requisitions' },
      { to: '/ict/issues', label: 'Issue Management' },
      { to: '/ict/servers', label: 'Servers' },
    ],
  },
  {
    label: 'Fleet Management',
    children: [
      { to: '/fleet/vehicles', label: 'Vehicles' },
      { to: '/fleet/spare-parts', label: 'Spare Parts' },
      { to: '/fleet/requisitions', label: 'Requisitions' },
      { to: '/fleet/receiving', label: 'Receiving' },
      { to: '/fleet/job-cards', label: 'Job Cards' },
    ],
  },
  {
    label: 'Stores Management',
    children: [
      { to: '/stores/items', label: 'Items' },
      { to: '/stores/grn', label: 'GRN' },
      { to: '/stores/ledger', label: 'Stock Ledger' },
      { to: '/stores/requisitions', label: 'Requisitions (Form 76A)' },
      { to: '/stores/issues', label: 'Issues' },
    ],
  },
  {
    label: 'Finance',
    children: [
      { to: '/finance/activities', label: 'Activities' },
    ],
  },
  {
    label: 'Administration',
    children: [
      { to: '/admin/users', label: 'User Management' },
      { to: '/admin/roles', label: 'Roles & Permissions' },
      { to: '/admin/departments', label: 'Departments' },
      { to: '/admin/settings', label: 'System Settings' },
      { to: '/admin/reports', label: 'System Reports' },
    ],
  },
];

export default function Layout() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gov-navy text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <h1 className="font-semibold text-lg">Government IMS</h1>
          <p className="text-xs text-white/70 mt-0.5">Integrated Management System</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="mb-2">
                <div className="px-3 py-1.5 text-xs font-medium text-white/60 uppercase tracking-wider">
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      'block px-3 py-2 rounded-md text-sm ' +
                      (isActive ? 'bg-gov-blue text-white' : 'text-white/85 hover:bg-white/10')
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  'block px-3 py-2 rounded-md text-sm mb-1 ' +
                  (isActive ? 'bg-gov-blue text-white' : 'text-white/85 hover:bg-white/10')
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="p-3 border-t border-white/10">
          {token && user && (
            <>
              <p className="text-xs text-white/70 truncate" title={user.email}>{user.name ?? user.email}</p>
              <button type="button" onClick={handleLogout} className="mt-1 text-xs text-white/70 hover:text-white">Sign out</button>
            </>
          )}
          {!token && (
            <NavLink to="/login" className="text-xs text-white/70 hover:text-white">Sign in</NavLink>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
