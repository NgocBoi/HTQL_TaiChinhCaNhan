import React, { useState, useEffect, useCallback } from 'react';
import { IoPieChart, IoAlertCircle } from 'react-icons/io5';
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
    return {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    };
  };

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoryApi.getCategories();
      const allCategories = data?.data?.categories || data?.categories || [];
      
      if (Array.isArray(allCategories)) {
        const expenseCats = allCategories.filter(c => {
          const typeNormalized = c.type?.toString().toLowerCase().trim();
          return typeNormalized === 'expense' || typeNormalized === 'chi tiêu';
        });
        setCategories(expenseCats);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/budgets?month=${month}&year=${year}`, getAuthHeader())
                         .catch(() => axios.get(`http://localhost:5000/api/budget?month=${month}&year=${year}`, getAuthHeader()));
      
      const budgetData = res.data?.data || res.data || [];
      setBudgets(Array.isArray(budgetData) ? budgetData : []);
    } catch (error) {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, [fetchCategories, fetchBudgets]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !amountLimit) return;
    setSubmitting(true);

    const payload = {
      categoryId: selectedCategory,
      amountLimit: Number(amountLimit),
      month: Number(month),
      year: Number(year)
    };

    try {
      await axios.post('http://localhost:5000/api/budgets', payload, getAuthHeader())
        .catch(() => axios.post('http://localhost:5000/api/budget', payload, getAuthHeader()));

      toast.success('Thiết lập hạn mức ngân sách thành công');
      setAmountLimit('');
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lưu hạn mức ngân sách');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-1 sm:p-4 text-slate-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <IoPieChart className="text-emerald-500" size={26} />
          Quản Lý Ngân Sách Chi Tiêu
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Thiết lập giới hạn chi tiêu theo từng danh mục để kiểm soát tài chính
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Thời gian theo dõi ngân sách:</span>
          <div className="flex gap-3">
            <select 
              value={month} 
              onChange={e => setMonth(e.target.value)} 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
            <input 
              type="number" 
              value={year} 
              onChange={e => setYear(e.target.value)} 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm w-24 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>

        <form onSubmit={handleSaveBudget} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end shadow-sm">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Danh mục chi tiêu</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)} 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer" 
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => {
                const catId = cat.id || cat._id;
                return (
                  <option key={catId} value={catId}>{cat.name}</option>
                );
              })}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Hạn mức giới hạn (VNĐ)</label>
            <input 
              type="number" 
              value={amountLimit} 
              onChange={e => setAmountLimit(e.target.value)} 
              placeholder="Ví dụ: 3000000" 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-600" 
              required 
              min="1" 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl font-medium text-sm hover:bg-emerald-500 shadow-md shadow-emerald-900/10 transition duration-200 h-[38px] disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu Ngân Sách'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        ⏱️ Tình hình sử dụng ngân sách tháng {month}/{year}
      </h2>

      {loading ? (
        <p className="text-center text-slate-400 text-sm py-8">Đang tải dữ liệu hạn mức...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {Array.isArray(budgets) && budgets.map(b => {
            const percent = b.amountLimit > 0 ? Math.min((b.totalSpent / b.amountLimit) * 100, 100) : 0;
            const isOver = b.totalSpent > b.amountLimit;
            const budgetId = b._id || b.id;

            return (
              <div key={budgetId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">{b.categoryName || b.Category?.name}</span>
                  <span className={`text-sm font-semibold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {(b.totalSpent || 0).toLocaleString()} / {(b.amountLimit || 0).toLocaleString()} đ
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                
                {isOver && (
                  <div className="text-rose-500 dark:text-rose-400 text-xs font-medium mt-3 flex items-center gap-1 animate-pulse">
                    <IoAlertCircle size={14} />
                    Danh mục này đã chi vượt hạn mức quy định!
                  </div>
                )}
              </div>
            );
          })}

          {budgets.length === 0 && (
            <p className="text-center text-slate-400 italic bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-sm shadow-sm">
              Chưa có mục chi tiêu nào được thiết lập ngân sách trong tháng này.
            </p>
          )}
        </div>
      )}
    </div>
  );
}