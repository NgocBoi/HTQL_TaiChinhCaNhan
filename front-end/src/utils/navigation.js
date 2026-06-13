export const getHomePath = (user) =>
  user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

export const isAdmin = (user) => user?.role === 'admin';
