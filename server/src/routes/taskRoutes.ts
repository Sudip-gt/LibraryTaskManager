import express from 'express';
import { authenticate } from '../middleware/auth';
import { createReturnTask, getTaskByBookId, getUserTasks } from '../controllers/taskController';

const router = express.Router();

router.post('/return-task', authenticate, createReturnTask);

router.post('/by-book/:bookId', authenticate, getTaskByBookId);
router.get('/my-tasks', authenticate, getUserTasks)
export default router;
