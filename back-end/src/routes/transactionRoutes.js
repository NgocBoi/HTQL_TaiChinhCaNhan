import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  getTransactionsValidator,
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
} from '../validators/transactionValidator.js';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  getTransactionsValidator,
  validate,
  transactionController.getTransactions
);

router.get(
  '/:id',
  transactionIdValidator,
  validate,
  transactionController.getTransactionById
);

router.post(
  '/',
  createTransactionValidator,
  validate,
  transactionController.createTransaction
);

router.put(
  '/:id',
  updateTransactionValidator,
  validate,
  transactionController.updateTransaction
);

router.delete(
  '/:id',
  transactionIdValidator,
  validate,
  transactionController.deleteTransaction
);

export default router;
