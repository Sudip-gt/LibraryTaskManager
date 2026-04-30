import { Request, Response } from 'express';
import Book from '../models/Book';

export const createBook = async (req: Request, res: Response) => {
    const { title, author, description, borrowFee } = req.body;
    const book = await Book.create({ title, author, description, borrowFee });
    res.status(201).json(book);
};

export const getAllBooks = async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
    const search = (req.query.search as string || '').trim();

    const filter: Record<string, unknown> = {};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
        ];
    }

    const [books, total] = await Promise.all([
        Book.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Book.countDocuments(filter),
    ]);

    res.json({
        books,
        page,
        totalPages: Math.ceil(total / limit),
        total,
    });
};

export const getBookById = async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
};

export const updateBook = async (req: Request, res: Response) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    if (book.isBorrowed) {
        return res.status(400).json({ message: 'Book is currently borrowed and cannot be deleted' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
};
