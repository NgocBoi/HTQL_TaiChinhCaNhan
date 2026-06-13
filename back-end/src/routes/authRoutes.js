import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from '../validators/authValidator.js';

const router = Router();

router.post(
  '/register',
  registerValidator,
  validate,
  authController.register
);

router.post('/login', loginValidator, validate, authController.login);

router.get('/profile', authMiddleware, authController.getProfile);

router.put(
  '/profile',
  authMiddleware,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

export default router;
