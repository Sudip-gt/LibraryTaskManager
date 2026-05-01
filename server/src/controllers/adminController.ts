import { Request, Response } from 'express';
import { JwtPayload } from '../middleware/auth';
import Book from '../models/Book';
import Task from '../models/Task';
import User from '../models/User';

const FINE_PER_DAY = 1; // $1 per day overdue

export const getAdminStats = async (_req: Request, res: Response) => {
    try {
        const [totalBooks, totalUsers, activeBorrows, overdueTasks] = await Promise.all([
            Book.countDocuments(),
            User.countDocuments(),
            Book.countDocuments({ isBorrowed: true }),
            Task.countDocuments({ completed: false, dueDate: { $lt: new Date() } }),
        ]);

        res.status(200).json({
            totalBooks,
            totalUsers,
            activeBorrows,
            overdueTasks,
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

export const getOverdueBooks = async (_req: Request, res: Response) => {
    try {
        const overdueTasks = await Task.find({
            completed: false,
            dueDate: { $lt: new Date() },
        }).populate('relatedBook').populate('user', 'name email');

        const overdueList = overdueTasks.map((task) => {
            const daysOverdue = Math.floor(
                (Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            return {
                task,
                daysOverdue,
                fine: daysOverdue * FINE_PER_DAY,
            };
        });

        res.status(200).json(overdueList);
    } catch (err) {
        console.error('Overdue books error:', err);
        res.status(500).json({ message: 'Failed to fetch overdue books' });
    }
};

export const getUserBorrowHistory = async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.userId;

    try {
        const currentlyBorrowed = await Book.find({ borrowedBy: userId, isBorrowed: true });

        const tasks = await Task.find({ user: userId }).populate('relatedBook').sort({ createdAt: -1 });

        const history = tasks.map((task) => ({
            book: task.relatedBook,
            dueDate: task.dueDate,
            completed: task.completed,
            isOverdue: !task.completed && new Date(task.dueDate) < new Date(),
            fine: !task.completed && new Date(task.dueDate) < new Date()
                ? Math.floor((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)) * FINE_PER_DAY
                : 0,
        }));

        res.status(200).json({ currentlyBorrowed, history });
    } catch (err) {
        console.error('Borrow history error:', err);
        res.status(500).json({ message: 'Failed to fetch borrow history' });
    }
};

export const getUserFines = async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.userId;

    try {
        const overdueTasks = await Task.find({
            user: userId,
            completed: false,
            dueDate: { $lt: new Date() },
        }).populate('relatedBook');

        let totalFine = 0;
        const fines = overdueTasks.map((task) => {
            const daysOverdue = Math.floor(
                (Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            const fine = daysOverdue * FINE_PER_DAY;
            totalFine += fine;
            return {
                task,
                daysOverdue,
                fine,
            };
        });

        res.status(200).json({ fines, totalFine });
    } catch (err) {
        console.error('User fines error:', err);
        res.status(500).json({ message: 'Failed to fetch fines' });
    }
};
