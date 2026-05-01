import express from 'express';
import { createReturnTask, getTaskByBookId, getUserTasks, toggleTaskComplete } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/return-task', authenticate, createReturnTask);
router.get('/by-book/:bookId', authenticate, getTaskByBookId);
router.get('/my-tasks', authenticate, getUserTasks);
router.patch('/:taskId/toggle', authenticate, toggleTaskComplete);

export default router;
