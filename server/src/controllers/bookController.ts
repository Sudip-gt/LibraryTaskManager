import { Request, Response } from 'express';
import Book from '../models/Book';

export const createBook = async (req: Request, res: Response) => {
    const { title, author, description, borrowFee } = req.body;
    const book = await Book.create({ title, author, description, borrowFee });
    res.status(201).json(book);
};

export const getAllBooks = async (_req: Request, res: Response) => {
    const books = await Book.find();
    res.json(books);
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
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    if (book.isBorrowed) {
        return res.status(400).json({ message: 'Book is currently borrowed' });
    }
    res.json({ message: 'Book deleted successfully' });
};
