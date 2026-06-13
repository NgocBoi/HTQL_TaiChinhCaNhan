import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/navigation';

export default function ProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PageLoader label="Đang xác thực..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin mặc định dùng giao diện Admin (trừ khi chủ đích vào app User qua sidebar)
  const allowUserApp =
    location.state?.allowUserApp === true ||
    sessionStorage.getItem('pfm_allow_user_app') === '1';

  if (isAdmin(user) && !allowUserApp) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
