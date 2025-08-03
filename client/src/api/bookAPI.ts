import axios from 'axios';
import type { Book } from '../types/book';

const BASE_URL = 'http://localhost:5000/api/books';

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const borrowBook = async (bookId: string, token: string) => {
  await axios.post(`${BASE_URL}/borrow/${bookId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const returnBook = async (bookId: string, token: string) => {
  await axios.post(`${BASE_URL}/return/${bookId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
