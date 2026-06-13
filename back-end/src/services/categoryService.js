import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { ApiError } from '../utils/ApiError.js';

const formatCategory = (category) => ({
  id: category._id,
  name: category.name,
  type: category.type,
  user: category.user,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const findUserCategory = async (categoryId, userId) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
};

export const getCategories = async (userId, { type } = {}) => {
  const filter = { user: userId };

  if (type) {
    filter.type = type;
  }

  const categories = await Category.find(filter).sort({ createdAt: -1 });

  return categories.map(formatCategory);
};

export const createCategory = async (userId, { name, type }) => {
  const existing = await Category.findOne({
    user: userId,
    name: name.trim(),
    type,
  });

  if (existing) {
    throw new ApiError(400, 'Category with this name and type already exists');
  }

  const category = await Category.create({
    name: name.trim(),
    type,
    user: userId,
  });

  return formatCategory(category);
};

export const updateCategory = async (userId, categoryId, updates) => {
  const category = await findUserCategory(categoryId, userId);
  const originalType = category.type;

  if (updates.name !== undefined) {
    category.name = updates.name.trim();
  }

  if (updates.type !== undefined) {
    category.type = updates.type;
  }

  const duplicate = await Category.findOne({
    _id: { $ne: category._id },
    user: userId,
    name: category.name,
    type: category.type,
  });

  if (duplicate) {
    throw new ApiError(400, 'Category with this name and type already exists');
  }

  if (updates.type !== undefined && updates.type !== originalType) {
    const linkedCount = await Transaction.countDocuments({
      category: category._id,
      user: userId,
    });

    if (linkedCount > 0) {
      throw new ApiError(
        400,
        'Cannot change category type while transactions are linked'
      );
    }
  }

  await category.save();

  return formatCategory(category);
};

export const deleteCategory = async (userId, categoryId) => {
  const category = await findUserCategory(categoryId, userId);

  const transactionCount = await Transaction.countDocuments({
    category: category._id,
    user: userId,
  });

  if (transactionCount > 0) {
    throw new ApiError(
      400,
      'Cannot delete category that has linked transactions'
    );
  }

  await category.deleteOne();

  return { id: categoryId };
};
