import { useEffect, useState } from 'react';
import {
  IoArrowDownCircle,
  IoArrowUpCircle,
  IoPieChart,
  IoStatsChart,
  IoWallet,
  IoBarChart,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as dashboardApi from '../api/dashboardApi';
import * as statisticsApi from '../api/statisticsApi';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import PageLoader from '../components/PageLoader';
import StatCard from '../components/StatCard';
import { formatCurrency, getErrorMessage } from '../utils/format';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, monthlyRes, catRes] = await Promise.all([
          dashboardApi.getDashboard(),
          statisticsApi.getMonthlyStatistics(),
          statisticsApi.getCategoryStatistics(),
        ]);

        setDashboard(dashRes.data.data.dashboard);
        setMonthly(monthlyRes.data.data.monthly);
        setCategories(catRes.data.data.categories);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader label="Đang tải tổng quan..." />;
  }

  const chartMonthly = monthly.map((m) => ({
    name: m.monthLabel?.slice(5) || m.monthLabel,
    fullLabel: m.monthLabel,
    Thu: m.income,
    Chi: m.expense,
  }));

  const hasMonthlyData = chartMonthly.some((m) => m.Thu > 0 || m.Chi > 0);
  const hasCategoryData = categories.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan tài chính"
        description="Theo dõi thu chi và xu hướng tài chính của bạn"
      />

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Tổng thu"
          value={formatCurrency(dashboard?.totalIncome)}
          icon={IoArrowUpCircle}
          variant="income"
        />
        <StatCard
          title="Tổng chi"
          value={formatCurrency(dashboard?.totalExpense)}
          icon={IoArrowDownCircle}
          variant="expense"
        />
        <StatCard
          title="Số dư"
          value={formatCurrency(dashboard?.balance)}
          icon={IoWallet}
          variant="balance"
          trend={
            (dashboard?.balance ?? 0) >= 0
              ? 'Tài chính đang dương'
              : 'Chi vượt thu'
          }
        />
        <StatCard
          title="Số giao dịch"
          value={String(dashboard?.transactionCount ?? 0)}
          icon={IoStatsChart}
          variant="default"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <ChartCard
          title="Thu chi theo tháng"
          description="12 tháng gần nhất — biểu đồ cột"
          className="lg:col-span-1"
        >
          {hasMonthlyData ? (
            <MonthlyBarChart data={chartMonthly} />
          ) : (
            <EmptyState
              icon={IoBarChart}
              title="Chưa có dữ liệu tháng"
              description="Thêm giao dịch để xem biểu đồ thu chi theo tháng"
              className="py-12"
            />
          )}
        </ChartCard>

        <ChartCard
          title="Phân bổ theo danh mục"
          description="Tỷ lệ chi tiêu theo từng danh mục — biểu đồ tròn"
        >
          {hasCategoryData ? (
            <CategoryPieChart data={categories} />
          ) : (
            <EmptyState
              icon={IoPieChart}
              title="Chưa có dữ liệu danh mục"
              description="Tạo giao dịch với danh mục để xem biểu đồ tròn"
              className="py-12"
            />
          )}
        </ChartCard>
      </div>

      {/* Category breakdown list - mobile friendly */}
      {hasCategoryData && (
        <ChartCard title="Chi tiết danh mục" description="Top danh mục theo số tiền">
          <div className="space-y-3">
            {categories.slice(0, 6).map((item, index) => {
              const total = categories.reduce((s, c) => s + c.amount, 0);
              const percent = total ? Math.round((item.amount / total) * 100) : 0;
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {item.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(item.amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
