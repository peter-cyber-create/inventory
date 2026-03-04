import { useNavigate } from 'react-router-dom';
import { getToken, getUser } from '../../services/auth';
import { clearAuthToken } from '../../services/api';

export default function Header() {
  const navigate = useNavigate();
  const user = getUser();
  const token = getToken();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-gov-primary border-b border-gov-secondary/50 shadow-header shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src="/mohgou.png"
          alt="Government of Uganda / Ministry of Health"
          className="h-8 w-8 rounded-full border border-white/40 bg-white object-contain"
        />
        <div className="flex flex-col">
          <h1 className="text-heading-lg text-white font-semibold leading-tight tracking-tight">
            Ministry of Health
          </h1>
          <span className="text-body-xs text-white/80">
            Inventory Management System
          </span>
        </div>
        {typeof __BUILD_TIME__ !== 'undefined' && (
          <span className="text-label text-white/60 hidden md:inline" title="Build time">
            Build: {new Date(__BUILD_TIME__).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {token && user && (
          <>
            <span className="text-body-sm text-white/90" title={user.email}>
              {user.name ?? user.email}
            </span>
            {user.role?.name && (
              <span className="text-label text-white/80 bg-white/10 px-2 py-0.5 rounded-form">
                {user.role.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-body-sm text-white/90 hover:text-white border border-white/30 hover:border-white/50 px-3 py-1.5 rounded-button transition-colors duration-fast"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
