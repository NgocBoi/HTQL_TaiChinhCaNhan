import api from './axios';

export const getMonthlyStatistics = () => api.get('/statistics/monthly');

export const getCategoryStatistics = () => api.get('/statistics/categories');
