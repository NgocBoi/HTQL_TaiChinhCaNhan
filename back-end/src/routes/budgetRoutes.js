import express from 'express';
// 1. Nhập chính xác tên hàm authMiddleware từ đúng file của bạn
import { authMiddleware } from '../middleware/authMiddleware.js'; 
// 2. Nhập các hàm xử lý từ budgetController.js
import { createOrUpdateBudget, getBudgets } from '../controllers/budgetController.js';

const router = express.Router();

// 3. Áp dụng middleware authMiddleware để chặn và bảo mật các API ngân sách
router.use(authMiddleware); 

router.post('/', createOrUpdateBudget);
router.get('/', getBudgets);

export default router;