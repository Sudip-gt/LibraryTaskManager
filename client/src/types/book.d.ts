import type { Task } from "./task";

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  borrowFee: number;
  isBorrowed: boolean;
  borrowedBy?: string | null;
  borrowedAt?: string | null;
}

interface BookState {
  books: Book[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  search: string;
}