import { useCallback, useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoPeople, IoSearch, IoTrash } from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as adminApi from '../../api/adminApi';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';
import RoleBadge from '../../components/RoleBadge';
import Select from '../../components/Select';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';
import { formatDate, getErrorMessage } from '../../utils/format';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  isActive: true,
};

const getUserId = (u) => u?.id?.toString?.() || u?.id;

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await adminApi.getUsers();
      setUsers(data.data.users);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      confirmPassword: '',
      role: u.role,
      isActive: u.isActive,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!editing && !form.password) {
      setFormError('Mật khẩu là bắt buộc khi tạo tài khoản');
      return;
    }

    if (form.password && form.password.length < 6) {
      setFormError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp');
      return;
    }

    setSubmitting(true);

    try {
      if (editing) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          isActive: form.isActive,
        };
        if (form.password) {
          payload.password = form.password;
        }
        await adminApi.updateUser(getUserId(editing), payload);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await adminApi.createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          isActive: form.isActive,
        });
        toast.success('Tạo người dùng thành công');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const newStatus = !targetUser.isActive;
    const action = newStatus ? 'mở khóa' : 'khóa';

    if (
      !window.confirm(
        `Bạn có chắc muốn ${action} tài khoản "${targetUser.name}"?`
      )
    ) {
      return;
    }

    setActionId(getUserId(targetUser));

    try {
      await adminApi.updateUserStatus(getUserId(targetUser), newStatus);
      toast.success(newStatus ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (targetUser) => {
    if (
      !window.confirm(
        `Xóa vĩnh viễn "${targetUser.name}"? Toàn bộ giao dịch và danh mục của họ sẽ bị xóa.`
      )
    ) {
      return;
    }

    setActionId(getUserId(targetUser));

    try {
      await adminApi.deleteUser(getUserId(targetUser));
      toast.success('Đã xóa người dùng');
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <PageLoader label="Đang tải danh sách người dùng..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý người dùng"
        description="Thêm, sửa, xóa và quản lý tài khoản người dùng"
        action={
          <Button onClick={openCreate}>
            <IoAdd size={20} />
            Thêm người dùng
          </Button>
        }
      />

      <div className="relative max-w-md">
        <IoSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={IoPeople}
          title="Không tìm thấy người dùng"
          description={
            search ? 'Thử từ khóa khác' : 'Bấm "Thêm người dùng" để tạo tài khoản mới'
          }
          action={!search && <Button onClick={openCreate}>Thêm người dùng</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Họ tên</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Vai trò</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => {
                  const uid = getUserId(u);
                  const isSelf = uid === getUserId(currentUser);
                  const busy = actionId === uid;

                  return (
                    <tr
                      key={uid}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-indigo-500">
                            (Bạn)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge active={u.isActive} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                            title="Sửa"
                          >
                            <IoPencil size={18} />
                          </button>
                          <Button
                            size="sm"
                            variant={u.isActive ? 'danger' : 'primary'}
                            disabled={isSelf || busy}
                            loading={busy}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {isSelf ? '—' : u.isActive ? 'Khóa' : 'Mở'}
                          </Button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={isSelf || busy}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                            title="Xóa"
                          >
                            <IoTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Vai trò"
              name="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={USER_ROLES}
              disabled={editing && getUserId(editing) === getUserId(currentUser)}
            />
            <Select
              label="Trạng thái"
              name="isActive"
              value={form.isActive ? 'true' : 'false'}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === 'true' })
              }
              options={[
                { value: 'true', label: 'Hoạt động' },
                { value: 'false', label: 'Đã khóa' },
              ]}
              disabled={
                editing &&
                getUserId(editing) === getUserId(currentUser)
              }
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              {editing
                ? 'Mật khẩu mới (để trống nếu không đổi)'
                : 'Mật khẩu đăng nhập'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={editing ? 'Mật khẩu mới' : 'Mật khẩu'}
                name="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required={!editing}
              />
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                error={formError}
                required={!editing || !!form.password}
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
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
