import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label={isDark ? 'Bật sáng' : 'Bật tối'}
      title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
    >
      {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
    </button>
  );
}
