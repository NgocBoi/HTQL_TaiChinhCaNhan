import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/format';

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = await login(form);

    if (user.role !== 'admin') {
      logout();
      toast.error('Tài khoản này không có quyền quản trị');
      return;
    }

    sessionStorage.removeItem('pfm_allow_user_app');
    toast.success('Đăng nhập Admin thành công!');
    navigate('/admin/dashboard', { replace: true });
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-black/20">
      <h2 className="text-2xl font-bold text-slate-900">Đăng nhập Admin</h2>
      <p className="mt-1 text-sm text-slate-500">
        Vui lòng đăng nhập bằng tài khoản quản trị viên.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="admin@pfm.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full" loading={loading}>
          Đăng nhập Admin
        </Button>
      </form>
    </div>
  );
}