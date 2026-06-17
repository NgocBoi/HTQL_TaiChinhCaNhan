import { useCallback, useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoSwapHorizontal, IoTrash, IoDownloadOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as categoryApi from '../api/categoryApi';
import * as transactionApi from '../api/transactionApi';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import PageLoader from '../components/PageLoader';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import Select from '../components/Select';
import { TRANSACTION_TYPES } from '../utils/constants';
import { exportRevenueToExcel } from '../utils/exportExcel';
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  toInputDate,
} from '../utils/format';

const emptyForm = {
  amount: '',
  type: 'expense',
  note: '',
  date: toInputDate(new Date()),
  category: '',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Khởi tạo State lưu trữ mốc thời gian xem và xuất báo cáo
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    try {
      // Đồng bộ gửi month và year được chọn lên Server API
      const params = {
        month: selectedMonth,
        year: selectedYear,
        ...(filterType ? { type: filterType } : {})
      };
      const [txRes, catRes] = await Promise.all([
        transactionApi.getTransactions(params),
        categoryApi.getCategories(),
      ]);
      setTransactions(txRes.data?.data?.transactions || txRes.data?.transactions || []);
      setCategories(catRes.data?.data?.categories || catRes.data?.categories || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filterType, selectedMonth, selectedYear]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: toInputDate(new Date()) });
    setModalOpen(true);
  };

  const openEdit = (tx) => {
    setEditing(tx);
    setForm({
      amount: tx.amount,
      type: tx.type,
      note: tx.note || '',
      date: toInputDate(tx.date),
      category: tx.category?.id || tx.category?._id || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (editing) {
        await transactionApi.updateTransaction(editing.id || editing._id, payload);
        toast.success('Cập nhật giao dịch thành công');
      } else {
        await transactionApi.createTransaction(payload);
        toast.success('Tạo giao dịch thành công');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa giao dịch này?')) return;

    try {
      await transactionApi.deleteTransaction(id);
      toast.success('Đã xóa giao dịch');
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Kích hoạt xuất dữ liệu có truyền đầy đủ tham số thời gian được chọn
  const handleExport = () => {
    try {
      exportRevenueToExcel(transactions, selectedMonth, selectedYear);
      toast.success(`Xuất file báo cáo tài chính tháng ${selectedMonth}/${selectedYear} thành công`);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xuất file');
    }
  };

  return (
    <div>
      <PageHeader
        title="Giao dịch"
        description="Quản lý các khoản thu chi"
        action={
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm py-2 px-4 rounded-xl shadow-sm transition duration-150"
            >
              <IoDownloadOutline size={18} className="text-emerald-500" />
              Xuất Báo Cáo Tài Chính Tháng
            </button>
            <Button onClick={openCreate}>
              <IoAdd size={20} />
              Thêm giao dịch
            </Button>
          </div>
        }
      />

      {/* Bộ điều hướng và Select lựa chọn thời gian */}
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-2">
          {['', 'income', 'expense'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => setFilterType(type)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filterType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              {type === '' ? 'Tất cả' : type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Xem thời gian:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none cursor-pointer font-medium"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs w-20 text-center font-medium focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <PageLoader label="Đang tải giao dịch..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={IoSwapHorizontal}
          title="Chưa có giao dịch"
          description="Không tìm thấy lịch sử giao dịch nào trong khoảng thời gian đã chọn"
          action={
            <div className="flex gap-2">
              <Button onClick={openCreate}>Thêm giao dịch</Button>
            </div>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Ngày</th>
                  <th className="px-4 py-3 font-medium">Danh mục</th>
                  <th className="px-4 py-3 font-medium">Ghi chú</th>
                  <th className="px-4 py-3 font-medium">Loại</th>
                  <th className="px-4 py-3 font-medium text-right">Số tiền</th>
                  <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id || tx._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {tx.category?.name || '—'}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-slate-500">
                      {tx.note || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tx.type === 'income' ? 'Thu' : 'Chi'}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        tx.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(tx)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
                        >
                          <IoPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id || tx._id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <IoTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Loại"
              name="type"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value, category: '' })
              }
              options={TRANSACTION_TYPES}
            />
            <Input
              label="Số tiền"
              name="amount"
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <Select
            label="Danh mục"
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: '', label: 'Chọn danh mục' },
              ...filteredCategories.map((c) => ({
                value: c.id || c._id,
                label: c.name,
              })),
            ]}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ngày"
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Input
              label="Ghi chú"
              name="note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Tùy chọn"
            />
          </div>

          {filteredCategories.length === 0 && (
            <p className="text-sm text-amber-600">
              Chưa có danh mục loại {form.type === 'income' ? 'thu nhập' : 'chi tiêu'}.
              Vui lòng tạo danh mục trước.
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
            <Button
              type="submit"
              className="flex-1"
              loading={submitting}
              disabled={!form.category}
            >
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}