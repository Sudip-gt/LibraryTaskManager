import express from 'express';
import { getAdminStats, getOverdueBooks, getUserBorrowHistory, getUserFines } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Admin-only routes
router.get('/stats', authenticate, requireAdmin, getAdminStats);
router.get('/overdue', authenticate, requireAdmin, getOverdueBooks);

// User routes
router.get('/my-history', authenticate, getUserBorrowHistory);
router.get('/my-fines', authenticate, getUserFines);

export default router;
