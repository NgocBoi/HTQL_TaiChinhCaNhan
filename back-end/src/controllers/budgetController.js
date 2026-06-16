// back-end/src/controllers/budgetController.js
import Budget from '../models/Budget.js';
import Transaction from '../models/transaction.js';
import mongoose from 'mongoose';

/**
 * @desc    Thêm mới hoặc cập nhật ngân sách (Đặt hạn mức chi tiêu)
 * @route   POST /api/budgets
 * @access  Private
 */
export const createOrUpdateBudget = async (req, res, next) => {
    // Lấy ID người dùng từ middleware bảo mật (authMiddleware)
    const userId = req.userId; 
    const { categoryId, amountLimit, month, year } = req.body;

    // Kiểm tra tính đầy đủ của dữ liệu đầu vào
    if (!categoryId || !amountLimit || !month || !year) {
        return res.status(400).json({ 
            success: false, 
            message: "Vui lòng điền đầy đủ các trường thông tin!" 
        });
    }

    try {
        // findOneAndUpdate: Tìm xem tháng đó danh mục đó của user đã có hạn mức chưa
        // Nếu có rồi -> Cập nhật (Update) số tiền mới
        // Nếu chưa có -> Tự động chèn mới (Insert) nhờ thuộc tính { upsert: true }
        const budget = await Budget.findOneAndUpdate(
            { userId, categoryId, month: parseInt(month), year: parseInt(year) },
            { amountLimit: parseFloat(amountLimit) },
            { new: true, upsert: true }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Thiết lập cấu hình ngân sách thành công!", 
            data: budget 
        });
    } catch (error) {
        // Chuyển tiếp lỗi sang middleware errorHandler.js xử lý tập trung
        next(error); 
    }
};

/**
 * @desc    Lấy toàn bộ ngân sách trong tháng được chọn kèm tổng số tiền đã tiêu thực tế
 * @route   GET /api/budgets
 * @access  Private
 */
export const getBudgets = async (req, res, next) => {
    try {
        // Ép kiểu userId thành ObjectId của Mongoose một cách nghiêm ngặt để Aggregate hoạt động đúng
        const userId = new mongoose.Types.ObjectId(req.userId);
        const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Sử dụng Aggregation Pipeline để thực hiện nối các collection (Join) và tính tổng dữ liệu
        const budgets = await Budget.aggregate([
            // Bước 1: Lọc ra các ngân sách khớp với user và mốc thời gian đang chọn
            { $match: { userId, month, year } },

            // Bước 2: Liên kết sang collection 'categories' để lấy thông tin chi tiết của danh mục
            {
                $lookup: {
                    from: 'categories', // Tên collection của danh mục trong MongoDB
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' }, // Trải phẳng mảng categoryInfo vừa join thành một đối tượng độc lập

            // Bước 3: Liên kết sang collection 'transactions' để tính tổng số tiền đã tiêu thực tế
            {
                $lookup: {
                    from: 'transactions', // Tên collection chứa các giao dịch trong DB
                    let: { b_userId: '$userId', b_catId: '$categoryId', b_month: '$month', b_year: '$year' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$b_userId'] },       // <--- ĐÃ ĐỔI: Sử dụng '$user' thay vì '$userId' theo đúng Model của bạn
                                        { $eq: ['$category', '$$b_catId'] },   // <--- ĐÃ ĐỔI: Sử dụng '$category' thay vì '$categoryId' theo đúng Model của bạn
                                        { $eq: [{ $month: '$date' }, '$$b_month'] }, // Trường lưu ngày trong Model của bạn là 'date'
                                        { $eq: [{ $year: '$date' }, '$$b_year'] },
                                        { $eq: ['$type', 'expense'] } // Ràng buộc chỉ tính các khoản Chi Tiêu
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$amount' } // Sử dụng toán tử $sum để cộng tổng tiền của trường 'amount'
                            }
                        }
                    ],
                    as: 'spentInfo'
                }
            },

            // Bước 4: Định dạng cấu trúc JSON trả về để Frontend (React) dễ dàng bóc tách dữ liệu
            {
                $project: {
                    _id: 1,
                    amountLimit: 1,
                    month: 1,
                    year: 1,
                    categoryId: 1,
                    categoryName: '$categoryInfo.name',
                    totalSpent: { 
                        $ifNull: [{ $arrayElemAt: ['$spentInfo.total', 0] }, 0] 
                    } // Nếu tháng đó danh mục đó chưa tiêu đồng nào thì trả về số 0
                }
            }
        ]);

        return res.status(200).json({ 
            success: true, 
            data: budgets 
        });
    } catch (error) {
        next(error);
    }
};