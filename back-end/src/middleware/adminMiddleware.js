import { ApiError } from '../utils/ApiError.js';

export const adminMiddleware = (req, res, next) => {
  const role = req.user?.role || req.userRole;

  if (role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin privileges required');
  }

  next();
};
