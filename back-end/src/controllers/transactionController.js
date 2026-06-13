import * as transactionService from '../services/transactionService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getTransactions(req.userId, {
    type: req.query.type,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
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
