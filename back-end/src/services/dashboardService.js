import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

const toObjectId = (userId) => new mongoose.Types.ObjectId(userId);

export const getDashboard = async (userId) => {
  const [result] = await Transaction.aggregate([
    { $match: { user: toObjectId(userId) } },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
            },
          },
        ],
        transactionCount: [{ $count: 'count' }],
      },
    },
  ]);

  const totals = result?.totals ?? [];
  const totalIncome =
    totals.find((item) => item._id === 'income')?.total ?? 0;
  const totalExpense =
    totals.find((item) => item._id === 'expense')?.total ?? 0;
  const transactionCount = result?.transactionCount[0]?.count ?? 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount,
  };
};
