import { Request, Response } from 'express';
import { JwtPayload } from '../middleware/auth';
import Book from '../models/Book';
import Task from '../models/Task';

export const createReturnTask = async (req: Request & { user?: JwtPayload }, res: Response) => {
  const { bookId } = req.body;
  const userId = req.user?.userId;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existingTask = await Task.findOne({
      user: userId, relatedBook: bookId,
      title: { $regex: new RegExp(`Return "${book.title}"`, 'i') },
    });
    if (existingTask) return res.status(200).json({ existingTask });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const task = await Task.create({
      user: userId,
      title: `Return "${book.title}" by ${dueDate.toDateString()}`,
      dueDate,
      completed: false,
      relatedBook: bookId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation failed:', error);
    res.status(500).json({ message: 'Failed to create return task' });
  }
};

export const getTaskByBookId = async (req: Request & { user?: JwtPayload }, res: Response) => {
  const userId = req.user?.userId;
  const bookId = req.params.bookId;

  try {
    const task = await Task.findOne({ user: userId, relatedBook: bookId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);   ////////////////
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTasks = async (req: Request & { user?: JwtPayload }, res: Response) => {
  const userId = req.user?.userId;
  try {
    const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const toggleTaskComplete = async (req: Request & { user?: JwtPayload }, res: Response) => {
  const userId = req.user?.userId;
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};
