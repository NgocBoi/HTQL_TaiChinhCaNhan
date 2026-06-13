import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('currentPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password cannot be empty'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  body().custom((value) => {
    const hasProfileField = value.name !== undefined || value.email !== undefined;
    const hasPasswordChange =
      value.currentPassword !== undefined || value.newPassword !== undefined;

    if (!hasProfileField && !hasPasswordChange) {
      throw new Error('At least one field is required to update');
    }

    if (value.newPassword && !value.currentPassword) {
      throw new Error('Current password is required to set a new password');
    }

    if (value.currentPassword && !value.newPassword) {
      throw new Error('New password is required when providing current password');
    }

    return true;
  }),
];
