import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

const toObjectId = (userId) => new mongoose.Types.ObjectId(userId);

const buildLast12MonthsRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  startDate.setHours(0, 0, 0, 0);

  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    });
  }

  return { startDate, months };
};

export const getMonthlyStatistics = async (userId) => {
  const { startDate, months } = buildLast12MonthsRange();

  const aggregated = await Transaction.aggregate([
    {
      $match: {
        user: toObjectId(userId),
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        key: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
        income: 1,
        expense: 1,
      },
    },
  ]);

  const dataMap = new Map(aggregated.map((item) => [item.key, item]));

  return months.map(({ year, month, key }) => {
    const stats = dataMap.get(key);
    const income = stats?.income ?? 0;
    const expense = stats?.expense ?? 0;

    return {
      year,
      month,
      monthLabel: key,
      income,
      expense,
      balance: income - expense,
    };
  });
};

export const getCategoryStatistics = async (userId) => {
  return Transaction.aggregate([
    { $match: { user: toObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        amount: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $project: {
        _id: 0,
        category: '$categoryInfo.name',
        amount: 1,
      },
    },
    { $sort: { amount: -1 } },
  ]);
};
