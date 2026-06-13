import { body, param } from 'express-validator';

const categoryTypeValidator = body('type')
  .notEmpty()
  .withMessage('Category type is required')
  .isIn(['income', 'expense'])
  .withMessage('Category type must be income or expense');

export const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  categoryTypeValidator,
];

export const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Category type must be income or expense'),
  body().custom((value) => {
    if (value.name === undefined && value.type === undefined) {
      throw new Error('At least one field (name or type) is required');
    }
    return true;
  }),
];

export const categoryIdValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
];
