export default function StatCard({ title, value, icon: Icon, trend, variant = 'default' }) {
  const variants = {
    default:
      'from-slate-50 to-white border-slate-200 dark:from-slate-800/50 dark:to-slate-900 dark:border-slate-700',
    income:
      'from-emerald-50 to-white border-emerald-100 dark:from-emerald-950/40 dark:to-slate-900 dark:border-emerald-900/50',
    expense:
      'from-rose-50 to-white border-rose-100 dark:from-rose-950/40 dark:to-slate-900 dark:border-rose-900/50',
    balance:
      'from-indigo-50 to-white border-indigo-100 dark:from-indigo-950/40 dark:to-slate-900 dark:border-indigo-900/50',
  };

  const iconColors = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    income: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
    expense: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
    balance: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
  };

  const valueColors = {
    default: 'text-slate-900 dark:text-white',
    income: 'text-emerald-700 dark:text-emerald-400',
    expense: 'text-rose-700 dark:text-rose-400',
    balance: 'text-indigo-700 dark:text-indigo-400',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition hover:shadow-md sm:p-5 ${variants[variant]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
            {title}
          </p>
          <p
            className={`mt-1 truncate text-xl font-bold tracking-tight sm:mt-2 sm:text-2xl ${valueColors[variant]}`}
          >
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconColors[variant]}`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
