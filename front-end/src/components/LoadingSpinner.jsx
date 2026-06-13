const sizes = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-[3px]',
};

export default function LoadingSpinner({ size = 'md', className = '', label }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400 ${sizes[size]}`}
        role="status"
        aria-label="Đang tải"
      />
      {label && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
      )}
    </div>
  );
}
