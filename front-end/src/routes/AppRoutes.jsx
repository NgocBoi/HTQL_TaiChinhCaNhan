import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProfilePage from '../pages/ProfilePage';
import BudgetManagement from '../pages/BudgetManagement'; 
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import PageLoader from '../components/PageLoader';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import { useAuth } from '../hooks/useAuth';
import { getHomePath } from '../utils/navigation';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PageLoader />
      </div>
    );
  }

  return (
    <Navigate to={isAuthenticated ? getHomePath(user) : '/login'} replace />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
  </Route>
</Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          
          <Route path="/budgets" element={<BudgetManagement />} /> 
          
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}