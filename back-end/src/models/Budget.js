import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    amountLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ràng buộc duy nhất: Một user chỉ có một hạn mức ngân sách cho một danh mục trong một tháng/năm cố định
budgetSchema.index({ userId: 1, categoryId: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

// BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ FIX LỖI SYNTAXERROR TRÊN
export default Budget;