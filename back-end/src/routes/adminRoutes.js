import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createUserValidator,
  updateUserValidator,
  updateUserStatusValidator,
  userIdParamValidator,
} from '../validators/adminValidator.js';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', adminController.getAdminDashboard);

router.get('/users', adminController.getUsers);
router.post('/users', createUserValidator, validate, adminController.createUser);
router.get(
  '/users/:id',
  userIdParamValidator,
  validate,
  adminController.getUser
);
router.put(
  '/users/:id',
  updateUserValidator,
  validate,
  adminController.updateUser
);
router.patch(
  '/users/:id/status',
  updateUserStatusValidator,
  validate,
  adminController.updateUserStatus
);
router.delete(
  '/users/:id',
  userIdParamValidator,
  validate,
  adminController.deleteUser
);

export default router;
