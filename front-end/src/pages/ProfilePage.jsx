import { useEffect, useState } from 'react';
import { IoCreateOutline, IoMail, IoPerson, IoShield } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import PageLoader from '../components/PageLoader';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getErrorMessage } from '../utils/format';

const emptyForm = {
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ProfilePage() {
  const { user, refreshProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    refreshProfile()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshProfile]);

  const openEdit = () => {
    if (!user) return;
    setForm({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      setFormError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (form.newPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    setSubmitting(true);

    try {
      await updateProfile(payload);
      toast.success('Cập nhật hồ sơ thành công');
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <PageLoader label="Đang tải hồ sơ..." />;
  }

  return (
    <div>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Xem và chỉnh sửa thông tin tài khoản"
        action={
          <Button onClick={openEdit}>
            <IoCreateOutline size={20} />
            Chỉnh sửa hồ sơ
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-10">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white backdrop-blur">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-emerald-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ProfileRow icon={IoPerson} label="Họ tên" value={user.name} />
            <ProfileRow icon={IoMail} label="Email" value={user.email} />
            <ProfileRow
              icon={IoShield}
              label="Vai trò"
              value={user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            />
            <ProfileRow
              icon={IoPerson}
              label="Ngày tạo"
              value={formatDate(user.createdAt)}
            />
            <ProfileRow
              icon={IoShield}
              label="Trạng thái"
              value={user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Chỉnh sửa hồ sơ"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ tên"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Đổi mật khẩu (tùy chọn)
            </p>
            <div className="space-y-3">
              <Input
                label="Mật khẩu hiện tại"
                name="currentPassword"
                type="password"
                placeholder="Nhập nếu đổi mật khẩu"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
              />
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
              <Input
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                error={formError}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1" loading={submitting}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-medium text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
