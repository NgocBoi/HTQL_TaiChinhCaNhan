import Budget from '../models/Budget.js';
import Transaction from '../models/transaction.js';
import mongoose from 'mongoose';

/**
 * @desc    Thêm mới hoặc cập nhật hạn mức (Danh mục hoặc Hạn mức tổng)
 */
export const createOrUpdateBudget = async (req, res, next) => {
    const userId = req.userId; 
    const { categoryId, amountLimit, month, year } = req.body;

    // Không kiểm tra bắt buộc đối với categoryId nữa
    if (!amountLimit || !month || !year) {
        return res.status(400).json({ 
            success: false, 
            message: "Vui lòng điền đầy đủ số tiền, tháng và năm!" 
        });
    }

    try {
        // Nếu không có categoryId (hoặc chuỗi rỗng), lưu dưới dạng null đại diện cho Hạn mức tổng
        const targetQuery = {
            userId,
            month: parseInt(month),
            year: parseInt(year),
            categoryId: categoryId ? new mongoose.Types.ObjectId(categoryId) : null
        };

        const budget = await Budget.findOneAndUpdate(
            targetQuery,
            { amountLimit: parseFloat(amountLimit) },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: categoryId ? "Thiết lập hạn mức danh mục thành công!" : "Thiết lập hạn mức tổng tháng thành công!",
            data: budget
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy danh sách hạn mức kèm số tiền đã tiêu thực tế của tháng chọn
 */
export const getBudgets = async (req, res, next) => {
    const userId = req.userId;
    const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    const year = parseInt(req.query.year) || new Date().getFullYear();

    try {
        const budgets = await Budget.aggregate([
            { 
                $match: { 
                    userId: new mongoose.Types.ObjectId(userId),
                    month: month,
                    year: year
                } 
            },
            // Kết nối thông tin danh mục
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
            // Tính toán số tiền đã tiêu (totalSpent)
            {
                $lookup: {
                    from: 'transactions',
                    let: { b_catId: '$categoryId', b_month: '$month', b_year: '$year' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
                                        { $eq: [{ $month: '$date' }, '$$b_month'] },
                                        { $eq: [{ $year: '$date' }, '$$b_year'] },
                                        { $eq: ['$type', 'expense'] },
                                        // NẾU b_catId khác null: lọc theo danh mục cụ thể. NẾU b_catId là null: gom tất cả để tính hạn mức tổng
                                        {
                                            $cond: {
                                                if: { $ne: ['$$b_catId', null] },
                                                then: { $eq: ['$category', '$$b_catId'] },
                                                else: true
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$amount' }
                            }
                        }
                    ],
                    as: 'spentInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    amountLimit: 1,
                    month: 1,
                    year: 1,
                    categoryId: 1,
                    // Nếu categoryId là null thì gán tên hiển thị cố định là "HẠN MỨC TỔNG THÁNG"
                    categoryName: { $ifNull: ['$categoryInfo.name', '⭐ HẠN MỨC TỔNG THÁNG'] },
                    totalSpent: { 
                        $ifNull: [{ $arrayElemAt: ['$spentInfo.total', 0] }, 0] 
                    }
                }
            },
            // Sắp xếp đưa Hạn mức tổng lên đầu danh sách hiển thị
            { $sort: { categoryId: 1 } }
        ]);

        return res.status(200).json({ 
            success: true, 
            data: budgets 
        });
    } catch (error) {
        next(error);
    }
};