import * as categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.userId, {
    type: req.query.type,
  });

  sendSuccess(res, 200, 'Categories retrieved successfully', {
    categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.userId, req.body);

  sendSuccess(res, 201, 'Category created successfully', { category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.userId,
    req.params.id,
    req.body
  );

  sendSuccess(res, 200, 'Category updated successfully', { category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(
    req.userId,
    req.params.id
  );

  sendSuccess(res, 200, 'Category deleted successfully', result);
});
