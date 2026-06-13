import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

const formatCategoryRef = (category) => {
  if (!category) return null;

  return {
    id: category._id,
    name: category.name,
    type: category.type,
  };
};

const formatTransaction = (transaction) => ({
  id: transaction._id,
  amount: transaction.amount,
  type: transaction.type,
  note: transaction.note,
  date: transaction.date,
  user: transaction.user,
  category: formatCategoryRef(transaction.category),
  createdAt: transaction.createdAt,
});

const validateUserCategory = async (userId, categoryId, transactionType) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (category.type !== transactionType) {
    throw new ApiError(
      400,
      `Category type (${category.type}) does not match transaction type (${transactionType})`
    );
  }

  return category;
};

const findUserTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  }).populate('category', 'name type');

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  return transaction;
};

export const getTransactions = async (
  userId,
  { type, category, startDate, endDate } = {}
) => {
  const filter = { user: userId };

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  const transactions = await Transaction.find(filter)
    .populate('category', 'name type')
    .sort({ date: -1, createdAt: -1 });

  return transactions.map(formatTransaction);
};

export const getTransactionById = async (userId, transactionId) => {
  const transaction = await findUserTransaction(transactionId, userId);
  return formatTransaction(transaction);
};

export const createTransaction = async (userId, data) => {
  const { amount, type, note, date, category } = data;

  await validateUserCategory(userId, category, type);

  const transaction = await Transaction.create({
    amount,
    type,
    note: note || '',
    date: new Date(date),
    user: userId,
    category,
  });

  await transaction.populate('category', 'name type');

  return formatTransaction(transaction);
};

export const updateTransaction = async (userId, transactionId, updates) => {
  const transaction = await findUserTransaction(transactionId, userId);

  const nextType = updates.type ?? transaction.type;
  const nextCategoryId = updates.category ?? transaction.category._id.toString();

  if (updates.category !== undefined || updates.type !== undefined) {
    await validateUserCategory(userId, nextCategoryId, nextType);
  }

  if (updates.amount !== undefined) {
    transaction.amount = updates.amount;
  }

  if (updates.type !== undefined) {
    transaction.type = updates.type;
  }

  if (updates.note !== undefined) {
    transaction.note = updates.note;
  }

  if (updates.date !== undefined) {
    transaction.date = new Date(updates.date);
  }

  if (updates.category !== undefined) {
    transaction.category = updates.category;
  }

  await transaction.save();
  await transaction.populate('category', 'name type');

  return formatTransaction(transaction);
};

export const deleteTransaction = async (userId, transactionId) => {
  const transaction = await findUserTransaction(transactionId, userId);

  await transaction.deleteOne();

  return { id: transactionId };
};
