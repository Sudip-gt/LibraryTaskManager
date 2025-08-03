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