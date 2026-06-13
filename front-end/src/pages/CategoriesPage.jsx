import { useCallback, useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoPricetags, IoTrash } from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as categoryApi from '../api/categoryApi';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import PageLoader from '../components/PageLoader';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Select from '../components/Select';
import { CATEGORY_TYPES } from '../utils/constants';
import { getErrorMessage } from '../utils/format';

const emptyForm = { name: '', type: 'expense' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const params = filter ? { type: filter } : {};
      const { data } = await categoryApi.getCategories(params);
      setCategories(data.data.categories);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      type: cat.type,
    });
    setModalOpen(true);
  };

  const getCategoryId = (cat) => cat.id?.toString?.() || cat.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editing) {
        await categoryApi.updateCategory(getCategoryId(editing), form);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryApi.createCategory(form);
        toast.success('Tạo danh mục thành công');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      await categoryApi.deleteCategory(id?.toString?.() || id);
      toast.success('Đã xóa danh mục');
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Danh mục"
        description="Quản lý danh mục thu chi"
        action={
          <Button onClick={openCreate}>
            <IoAdd size={20} />
            Thêm danh mục
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        {['', 'income', 'expense'].map((type) => (
          <button
            key={type || 'all'}
            onClick={() => setFilter(type)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === type
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {type === '' ? 'Tất cả' : type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader label="Đang tải danh mục..." />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={IoPricetags}
          title="Chưa có danh mục"
          description="Tạo danh mục để phân loại giao dịch của bạn"
          action={<Button onClick={openCreate}>Thêm danh mục</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                      cat.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                    }`}
                  >
                    {cat.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                  </span>
                  <h3 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-white">
                    {cat.name}
                  </h3>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                    title="Sửa danh mục"
                  >
                    <IoPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(getCategoryId(cat))}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                    title="Xóa danh mục"
                  >
                    <IoTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa danh mục' : 'Thêm danh mục'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh mục"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Loại"
            name="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={CATEGORY_TYPES}
          />
          {editing && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Lưu ý: Không thể đổi loại danh mục khi đã có giao dịch liên kết.
            </p>
          )}
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
