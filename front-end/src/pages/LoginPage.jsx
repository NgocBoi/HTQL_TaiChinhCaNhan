import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/format';
import { getHomePath } from '../utils/navigation';

export default function LoginPage() {
  const { login } = useAuth();
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
      sessionStorage.removeItem('pfm_allow_user_app');
      toast.success('Đăng nhập thành công!');
      navigate(getHomePath(user), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-black/20">
      <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
      <p className="mt-1 text-sm text-slate-500">
        Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
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
          Đăng nhập
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
