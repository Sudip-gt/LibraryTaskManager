import type { Book } from '../types/book';
import API from './axiosInstance';

export interface PaginatedBooks {
  books: Book[];
  page: number;
  totalPages: number;
  total: number;
}

export const fetchBooks = async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedBooks> => {
  const res = await API.get('/books', { params });
  return res.data;
};

export const fetchBookById = async (bookId: string): Promise<Book> => {
  const res = await API.get(`/books/${bookId}`);
  return res.data;
};

export const createBookAPI = async (data: { title: string; author: string; description?: string; borrowFee: number }): Promise<Book> => {
  const res = await API.post('/books', data);
  return res.data;
};

export const updateBookAPI = async (bookId: string, data: Partial<{ title: string; author: string; description: string; borrowFee: number }>): Promise<Book> => {
  const res = await API.put(`/books/${bookId}`, data);
  return res.data;
};

export const deleteBookAPI = async (bookId: string): Promise<void> => {
  await API.delete(`/books/${bookId}`);
};

export const borrowBook = async (bookId: string, _token?: string) => {
  await API.post(`/books/borrow/${bookId}`);
};

export const returnBook = async (bookId: string, _token?: string) => {
  const res = await API.put(`/books/return/${bookId}`);
  return res.data;
};
