import { formatCurrency } from './format';

export const getChartTheme = (isDark) => ({
  grid: isDark ? '#334155' : '#e2e8f0',
  text: isDark ? '#94a3b8' : '#64748b',
  tooltipBg: isDark ? '#1e293b' : '#ffffff',
  tooltipBorder: isDark ? '#334155' : '#e2e8f0',
  tooltipText: isDark ? '#f1f5f9' : '#0f172a',
});

export const ChartTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  const theme = getChartTheme(isDark);

  return (
    <div
      className="rounded-xl border px-3 py-2 shadow-lg"
      style={{
        background: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      <p className="mb-1 text-xs font-medium opacity-70">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm font-semibold"
          style={{ color: entry.color || entry.payload?.fill }}
        >
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};
