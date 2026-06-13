export const TOKEN_KEY = 'pfm_token';
export const USER_KEY = 'pfm_user';
export const THEME_KEY = 'pfm_theme';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Thu nhập' },
  { value: 'expense', label: 'Chi tiêu' },
];

export const CATEGORY_TYPES = [
  { value: 'income', label: 'Thu nhập' },
  { value: 'expense', label: 'Chi tiêu' },
];

export const USER_ROLES = [
  { value: 'user', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị viên' },
];

export const CHART_COLORS = [
  '#059669',
  '#0d9488',
  '#0891b2',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#84cc16',
];
