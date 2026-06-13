import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CHART_COLORS } from '../../utils/constants';
import { getChartTheme, ChartTooltip } from '../../utils/chartHelpers.jsx';
import { formatCurrency } from '../../utils/format';

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-semibold sm:text-xs"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CategoryPieChart({ data }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.amount,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="h-64 w-full sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip isDark={isDark} />}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: 11, color: theme.text, paddingTop: 12 }}
            formatter={(value) =>
              value.length > 14 ? `${value.slice(0, 14)}…` : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
