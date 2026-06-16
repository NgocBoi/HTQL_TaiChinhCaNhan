import { NavLink } from 'react-router-dom';
import {
  IoGrid,
  IoSwapHorizontal,
  IoPricetags,
  IoPerson,
  IoWallet,
  IoShield,
  IoPieChart, 
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: IoGrid },
  { to: '/transactions', label: 'Giao dịch', icon: IoSwapHorizontal },
  { to: '/categories', label: 'Danh mục', icon: IoPricetags },
  { to: '/budgets', label: 'Ngân sách', icon: IoPieChart }, 
  { to: '/profile', label: 'Hồ sơ', icon: IoPerson },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <IoWallet size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">PFM System</p>
            <p className="text-xs text-slate-400">Quản lý tài chính</p>
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
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              onClick={() => {
                sessionStorage.removeItem('pfm_allow_user_app');
                onClose();
              }}
              className={({ isActive }) =>
                `mt-4 flex items-center gap-3 rounded-xl border border-indigo-800/60 px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <IoShield size={20} />
              Trang Admin
            </NavLink>
          )}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="text-center text-xs text-slate-500">
            Personal Finance v1.0
          </p>
        </div>
      </aside>
    </>
  );
}