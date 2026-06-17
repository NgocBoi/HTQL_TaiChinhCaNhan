import * as transactionService from '../services/transactionService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, month, year } = req.query;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  // Nếu phía Frontend gửi tham số lọc month và year, bóc tách khoảng thời gian cụ thể
  if (month && year) {
    const m = Number(month);
    const y = Number(year);
    
    // Ngày bắt đầu đầu tháng (Ví dụ chọn tháng 5: 2026-05-01T00:00:00.000Z)
    startDate = new Date(y, m - 1, 1).toISOString();
    
    // Ngày kết thúc cuối tháng (Ví dụ: 2026-05-31T23:59:59.999Z)
    endDate = new Date(y, m, 0, 23, 59, 59, 999).toISOString();
  }

  // Chuyển tiếp các tham số thời gian đã được chuẩn hóa xuống tầng nghiệp vụ Service
  const transactions = await transactionService.getTransactions(req.userId, {
    type,
    category,
    startDate,
    endDate,
  });

  sendSuccess(res, 200, 'Transactions retrieved successfully', {
    transactions,
  });
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(
    req.userId,
    req.params.id
  );

  sendSuccess(res, 200, 'Transaction retrieved successfully', {
    transaction,
  });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(
    req.userId,
    req.body
  );

  sendSuccess(res, 201, 'Transaction created successfully', { transaction });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(
    req.userId,
    req.params.id,
    req.body
  );

  sendSuccess(res, 200, 'Transaction updated successfully', { transaction });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const result = await transactionService.deleteTransaction(
    req.userId,
    req.params.id
  );

  sendSuccess(res, 200, 'Transaction deleted successfully', result);
});