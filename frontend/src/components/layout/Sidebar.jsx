import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getUser } from '../../services/auth';

const SIDEBAR_WIDTH = 248;
const SIDEBAR_COLLAPSED_WIDTH = 56;

const ALL_NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  {
    module: 'ICT',
    label: 'ICT',
    children: [
      { to: '/ict/dashboard', label: 'Dashboard' },
      { to: '/ict/assets', label: 'Assets Inventory' },
      { to: '/ict/maintenance', label: 'Maintenance' },
      { to: '/ict/requisitions', label: 'Requisitions' },
      { to: '/ict/issues', label: 'Issue Management' },
      { to: '/ict/servers', label: 'Servers' },
    ],
  },
  {
    module: 'Fleet',
    label: 'Fleet Management',
    children: [
      { to: '/fleet/dashboard', label: 'Dashboard' },
      { to: '/fleet/vehicles', label: 'Vehicles' },
      { to: '/fleet/spare-parts', label: 'Spare Parts' },
      { to: '/fleet/requisitions', label: 'Requisitions' },
      { to: '/fleet/receiving', label: 'Receiving' },
      { to: '/fleet/job-cards', label: 'Job Cards' },
    ],
  },
  {
    module: 'Stores',
    label: 'Stores Management',
    children: [
      { to: '/stores/dashboard', label: 'Dashboard' },
      { to: '/stores/items', label: 'Items' },
      { to: '/stores/grn', label: 'GRN' },
      { to: '/stores/ledger', label: 'Stock Ledger' },
      { to: '/stores/requisitions', label: 'Requisitions (Form 76A)' },
      { to: '/stores/issues', label: 'Issues' },
    ],
  },
  {
    module: 'Finance',
    label: 'Finance',
    children: [
      { to: '/finance/dashboard', label: 'Dashboard' },
      { to: '/activities/listing', label: 'Activities' },
      { to: '/finance/users', label: 'Users' },
      { to: '/report/activities', label: 'Reports' },
    ],
  },
  {
    module: 'Admin',
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

function getNavForUser(user) {
  const module = (user?.module || '').trim();
  if (!module || module === 'All' || module === 'All modules') return ALL_NAV;
  return ALL_NAV.filter((item) => !item.module || item.module === module);
}

export default function Sidebar({ collapsed, onToggle }) {
  const user = getUser();
  const nav = useMemo(() => getNavForUser(user), [user?.module]);
  const [expandedGroups, setExpandedGroups] = useState(() =>
    nav.reduce((acc, item, i) => ({ ...acc, [i]: item.children ? true : null }), {})
  );

  const toggleGroup = (i) => {
    setExpandedGroups((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const linkClass = ({ isActive }) =>
    'block py-2 px-3 text-body-sm border-l-2 transition-colors duration-fast ' +
    (isActive
      ? 'bg-gov-backgroundAlt border-gov-accent font-medium text-gov-primary'
      : 'border-transparent hover:bg-gov-backgroundAlt text-gov-secondary hover:text-gov-primary');

  const groupLabelClass = (i) =>
    'flex items-center justify-between w-full py-2 px-3 text-label text-gov-secondaryMuted uppercase tracking-wider cursor-pointer hover:bg-gov-backgroundAlt hover:text-gov-primary ' +
    (expandedGroups[i] ? 'bg-gov-backgroundAlt text-gov-primary' : '');

  return (
    <aside
      className="flex flex-col min-h-0 bg-gov-surface border-r border-gov-border shrink-0 transition-[width] duration-normal"
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
    >
      <div className="flex items-center justify-between h-12 px-3 border-b border-gov-border shrink-0">
        {!collapsed && (
          <span className="text-label text-gov-secondaryMuted uppercase tracking-wider">Navigation</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-2 text-gov-secondary hover:bg-gov-backgroundAlt hover:text-gov-primary rounded-form focus:outline-none focus:ring-1 focus:ring-gov-accent transition-colors duration-fast"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-normal ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto py-2">
        {nav.map((item, i) =>
          item.children ? (
            <div key={item.label} className="mb-1">
              {collapsed ? (
                <div className="px-2 py-1">
                  <div
                    className="group relative flex justify-center"
                    title={item.label}
                  >
                    <span className="text-label text-gov-secondaryMuted uppercase">…</span>
                    <div className="absolute left-full ml-1 top-0 hidden group-hover:block z-10 bg-gov-surface border border-gov-border rounded-card shadow-card py-1 min-w-[180px]">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            'block py-2 px-3 text-body-sm transition-colors ' +
                            (isActive ? 'bg-gov-backgroundAlt font-medium text-gov-accent' : 'text-gov-secondary hover:bg-gov-backgroundAlt text-gov-primary')
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleGroup(i)}
                    className={groupLabelClass(i)}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-normal ${expandedGroups[i] ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {expandedGroups[i] && (
                    <div className="pl-2">
                      {item.children.map((child) => (
                        <NavLink key={child.to} to={child.to} className={linkClass}>
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div key={item.to} className="px-2 mb-1">
              <NavLink to={item.to} className={linkClass} title={collapsed ? item.label : undefined}>
                {collapsed ? <span className="block truncate text-center text-label text-gov-secondary">{item.label.charAt(0)}</span> : item.label}
              </NavLink>
            </div>
          )
        )}
      </nav>
    </aside>
  );
}
