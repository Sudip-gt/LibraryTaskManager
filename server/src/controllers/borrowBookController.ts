import { Request, Response } from 'express';
import Book from '../models/Book';
import User from '../models/User';
import mongoose from 'mongoose';

declare interface userRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const borrowBook = async (req: userRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.isBorrowed) {
      return res.status(400).json({ message: 'Book is currently borrowed' });
    }

    book.isBorrowed = true;
    book.borrowedBy = new mongoose.Types.ObjectId(userId);
    book.borrowedAt = new Date();
    await book.save();

    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to borrow book' });
  }
};

export const returnBook = async (req: userRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isBorrowed || book.borrowedBy?.toString() !== userId) {
      return res.status(403).json({ message: 'You cannot return this book' });
    }

    book.isBorrowed = false;
    book.borrowedBy = null;
    book.borrowedAt = null;
    await book.save();

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to return book' });
  }
};
