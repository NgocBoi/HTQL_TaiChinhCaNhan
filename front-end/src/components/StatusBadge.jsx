export default function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
        active
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
      }`}
    >
      {active ? 'Hoạt động' : 'Đã khóa'}
    </span>
  );
}
