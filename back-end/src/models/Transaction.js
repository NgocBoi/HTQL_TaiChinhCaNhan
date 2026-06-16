import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

// Kiểm tra xem model 'Transaction' đã tồn tại trong bộ nhớ chưa, nếu có rồi thì dùng lại, chưa có mới tạo mới
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
