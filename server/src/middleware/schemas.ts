import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
}).strict();

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
}).strict();

export const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    author: z.string().min(1, 'Author is required').max(200),
    description: z.string().max(2000).optional(),
    borrowFee: z.number().positive('Borrow fee must be positive'),
}).strict();

export const updateBookSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    borrowFee: z.number().positive().optional(),
}).strict();
