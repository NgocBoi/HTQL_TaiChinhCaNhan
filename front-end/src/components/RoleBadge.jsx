export default function RoleBadge({ role }) {
  const isAdminRole = role === 'admin';

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
        isAdminRole
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {isAdminRole ? 'Admin' : 'User'}
    </span>
  );
}
