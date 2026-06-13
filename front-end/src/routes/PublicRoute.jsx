import { Navigate, Outlet } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { useAuth } from '../hooks/useAuth';
import { getHomePath } from '../utils/navigation';

export default function PublicRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <PageLoader label="Đang tải..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return <Outlet />;
}
