import React, { useState, useEffect, useCallback } from 'react';
import { IoPieChart, IoAlertCircle, IoSaveOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import * as categoryApi from '../api/categoryApi';
import axios from 'axios';

export default function BudgetManagement() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('pfm_token');
    return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
  };

  const fetchBudgets = useCallback(async () => {
    try {
      const tokenHeader = getAuthHeader();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.get(`${apiUrl}/budgets`, {
        ...tokenHeader,
        params: { month, year }
      });
      if (data?.success) setBudgets(data.data || []);
    } catch (error) {
      toast.error('Không thể tải dữ liệu hạn mức ngân sách');
    } finally { setLoading(false); }
  }, [month, year]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoryApi.getCategories();
      const allCategories = data?.data?.categories || data?.categories || [];
      if (Array.isArray(allCategories)) {
        const expenseCats = allCategories.filter(c => {
          const typeNormalized = c.type?.toString().toLowerCase();
          return typeNormalized === 'expense' || typeNormalized === 'chi tiêu' || typeNormalized === 'chi';
        });
        setCategories(expenseCats);
      }
    } catch (error) {
      toast.error('Không thể tải danh mục chi tiêu');
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { setLoading(true); fetchBudgets(); }, [fetchBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountLimit) {
      toast.error('Vui lòng nhập số tiền hạn mức!');
      return;
    }

    setSubmitting(true);
    try {
      const tokenHeader = getAuthHeader();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const payload = {
        categoryId: selectedCategory || null, // Nếu không chọn gì (để trống) -> gửi null lên để làm hạn mức tổng
        amountLimit: Number(amountLimit),
        month: Number(month),
        year: Number(year)
      };

      const { data } = await axios.post(`${apiUrl}/budgets`, payload, tokenHeader);

      if (data?.success) {
        toast.success(selectedCategory ? `Đã cấu hình hạn mức danh mục` : `Đã thiết lập Hạn mức tổng Tháng ${month}/${year}`);
        setAmountLimit('');
        setSelectedCategory('');
        fetchBudgets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <IoPieChart size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Quản lý hạn mức chi tiêu</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Thiết lập giới hạn chi tiêu độc lập theo danh mục hoặc tổng thể cả tháng</p>
          </div>
        </div>

        {/* Bộ chọn Thời gian */}
        <div className="flex items-center gap-2">
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-sm font-medium focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-sm w-24 text-center font-medium focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form cấu hình */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Thiết lập hạn mức Tháng {month}/{year}</h2>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loại hạn mức</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none font-medium"
            >
              {/* Thêm option trống này để làm Hạn mức tổng */}
              <option value="">-- HẠN MỨC TỔNG (Toàn bộ chi tiêu) --</option>
              {categories.map(c => (
                <option key={c.id || c._id} value={c.id || c._id}>Danh mục: {c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hạn mức số tiền tối đa (VNĐ)</label>
            <input 
              type="number"
              placeholder="Ví dụ: 10000000"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none"
              min="1000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md transition duration-150"
          >
            <IoSaveOutline size={18} />
            {submitting ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </form>

        {/* Khối hiển thị tiến độ */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <p className="text-center text-slate-400 py-6 sm:col-span-2">Đang xử lý dữ liệu...</p>
          ) : budgets.map((b) => {
            const percent = Math.min(((b.totalSpent || 0) / (b.amountLimit || 1)) * 100, 100);
            const isOver = (b.totalSpent || 0) >= (b.amountLimit || 0);
            const isTotalBudget = b.categoryId === null; // Nhận diện card hạn mức tổng

            return (
              <div 
                key={b._id} 
                className={`border p-5 rounded-2xl shadow-sm space-y-3 transition-all ${
                  isTotalBudget 
                    ? 'bg-slate-50/80 dark:bg-slate-950/40 border-slate-300 dark:border-slate-700 sm:col-span-2 ring-1 ring-emerald-500/20' 
                    : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-base ${isTotalBudget ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {b.categoryName}
                  </span>
                  <span className={`text-sm font-bold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {Math.round(percent)}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-300/30">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Đã tiêu: <b>{(b.totalSpent || 0).toLocaleString()} đ</b></span>
                  <span>Hạn mức giới hạn: <b>{(b.amountLimit || 0).toLocaleString()} đ</b></span>
                </div>
                
                {isOver && (
                  <div className="text-rose-500 dark:text-rose-400 text-xs font-semibold mt-2 flex items-center gap-1 animate-pulse">
                    <IoAlertCircle size={15} />
                    Cảnh báo: Đã chi vượt hạn mức quy định!
                  </div>
                )}
              </div>
            );
          })}

          {!loading && budgets.length === 0 && (
            <div className="text-center text-slate-400 italic bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm sm:col-span-2">
              Chưa thiết lập bất kỳ mục tiêu tài chính nào cho Tháng {month}/{year}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}