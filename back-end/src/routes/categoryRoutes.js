import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from '../validators/categoryValidator.js';

const router = Router();

router.use(authMiddleware);

router.get('/', categoryController.getCategories);

router.post(
  '/',
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

router.put(
  '/:id',
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  categoryIdValidator,
  validate,
  categoryController.deleteCategory
);

export default router;
