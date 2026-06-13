import { NavLink } from 'react-router-dom';
import {
  IoGrid,
  IoPeople,
  IoWallet,
  IoArrowBack,
} from 'react-icons/io5';

const navItems = [
  { to: '/admin/dashboard', label: 'Tổng quan hệ thống', icon: IoGrid },
  { to: '/admin/users', label: 'Quản lý người dùng', icon: IoPeople },
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-indigo-900/50 bg-slate-900 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <IoWallet size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">PFM Admin</p>
            <p className="text-xs text-indigo-300">Quản trị hệ thống</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/dashboard"
            state={{ allowUserApp: true }}
            onClick={() => {
              sessionStorage.setItem('pfm_allow_user_app', '1');
              onClose();
            }}
            className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            <IoArrowBack size={20} />
            Về ứng dụng User
          </NavLink>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="text-center text-xs text-slate-500">Admin Panel v1.0</p>
        </div>
      </aside>
    </>
  );
}
