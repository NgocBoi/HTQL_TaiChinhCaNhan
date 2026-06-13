export default function ChartCard({ title, description, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
