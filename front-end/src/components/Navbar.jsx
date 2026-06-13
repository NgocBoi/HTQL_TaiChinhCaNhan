import { IoLogOutOutline, IoMenu } from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 px-3 backdrop-blur-md sm:h-16 sm:px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Mở menu"
        >
          <IoMenu size={22} />
        </button>
        <h2 className="truncate text-base font-semibold text-slate-800 sm:text-lg lg:text-xl dark:text-white">
          {title}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden text-right lg:block">
            <p className="max-w-[140px] truncate text-sm font-medium text-slate-800 dark:text-white">
              {user?.name}
            </p>
            <p className="max-w-[140px] truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={logout} className="!px-2">
          <IoLogOutOutline size={20} />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}
