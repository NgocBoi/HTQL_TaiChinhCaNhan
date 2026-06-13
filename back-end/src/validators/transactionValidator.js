import { body, param, query } from 'express-validator';

const transactionTypeValidator = body('type')
  .notEmpty()
  .withMessage('Transaction type is required')
  .isIn(['income', 'expense'])
  .withMessage('Transaction type must be income or expense');

export const getTransactionsValidator = [
  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid date'),
];

export const createTransactionValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  transactionTypeValidator,
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
  body('date')
    .notEmpty()
    .withMessage('Transaction date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

export const updateTransactionValidator = [
  param('id').isMongoId().withMessage('Invalid transaction ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Transaction type must be income or expense'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body().custom((value) => {
    const fields = ['amount', 'type', 'note', 'date', 'category'];
    const hasUpdate = fields.some((field) => value[field] !== undefined);
    if (!hasUpdate) {
      throw new Error('At least one field is required to update');
    }
    return true;
  }),
];

export const transactionIdValidator = [
  param('id').isMongoId().withMessage('Invalid transaction ID'),
];
