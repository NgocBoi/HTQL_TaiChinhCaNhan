import { useEffect, useState } from 'react';
import {
  IoPeople,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSwapHorizontal,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/adminApi';
import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';
import StatCard from '../../components/StatCard';
import { getErrorMessage } from '../../utils/format';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await adminApi.getAdminDashboard();
        setDashboard(data.data.dashboard);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <PageLoader label="Đang tải thống kê hệ thống..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan hệ thống"
        description="Thống kê người dùng và giao dịch trên toàn hệ thống"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Tổng người dùng"
          value={String(dashboard?.totalUsers ?? 0)}
          icon={IoPeople}
          variant="balance"
        />
        <StatCard
          title="Đang hoạt động"
          value={String(dashboard?.activeUsers ?? 0)}
          icon={IoCheckmarkCircle}
          variant="income"
        />
        <StatCard
          title="Đã khóa"
          value={String(dashboard?.inactiveUsers ?? 0)}
          icon={IoCloseCircle}
          variant="expense"
        />
        <StatCard
          title="Tổng giao dịch"
          value={String(dashboard?.totalTransactions ?? 0)}
          icon={IoSwapHorizontal}
        />
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Trung tâm quản trị
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Sử dụng mục <strong>Quản lý người dùng</strong> để khóa hoặc mở khóa
          tài khoản. Người dùng bị khóa sẽ không thể đăng nhập cho đến khi được
          kích hoạt lại.
        </p>
      </div>
    </div>
  );
}
