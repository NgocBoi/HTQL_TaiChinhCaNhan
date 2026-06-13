import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { getChartTheme, ChartTooltip } from '../../utils/chartHelpers.jsx';

export default function MonthlyBarChart({ data }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  return (
    <div className="h-64 w-full sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: theme.text }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: theme.text }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000000
                ? `${(v / 1000000).toFixed(1)}M`
                : v >= 1000
                  ? `${(v / 1000).toFixed(0)}K`
                  : v
            }
            width={48}
          />
          <Tooltip
            content={<ChartTooltip isDark={isDark} />}
            cursor={{ fill: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(226,232,240,0.5)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: theme.text }}
            iconType="circle"
          />
          <Bar
            dataKey="Thu"
            fill="#059669"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="Chi"
            fill="#f43f5e"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
