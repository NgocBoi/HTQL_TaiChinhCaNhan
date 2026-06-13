import * as dashboardService from '../services/dashboardService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.userId);

  sendSuccess(res, 200, 'Dashboard data retrieved successfully', {
    dashboard,
  });
});
