import * as statisticsService from '../services/statisticsService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMonthlyStatistics = asyncHandler(async (req, res) => {
  const monthly = await statisticsService.getMonthlyStatistics(req.userId);

  sendSuccess(res, 200, 'Monthly statistics retrieved successfully', {
    monthly,
  });
});

export const getCategoryStatistics = asyncHandler(async (req, res) => {
  const categories = await statisticsService.getCategoryStatistics(req.userId);

  sendSuccess(res, 200, 'Category statistics retrieved successfully', {
    categories,
  });
});
