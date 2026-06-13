import { Navigate, Outlet } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/navigation';

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PageLoader label="Đang xác thực quyền admin..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  sessionStorage.removeItem('pfm_allow_user_app');

  return <Outlet />;
}
