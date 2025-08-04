import React from 'react';
import BookCard from './BookCard';
import type { Book } from './BookCard';

interface BookListProps {
  books: Book[];
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  isLoggedIn: boolean;
  loginErrorShownFor: string | null;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onBorrow,
  onReturn,
  isLoggedIn,
  loginErrorShownFor,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onBorrow={onBorrow}
          onReturn={onReturn}
          isLoggedIn={isLoggedIn}
          showLoginError={loginErrorShownFor === book._id}
        />
      ))}
    </div>
  );
};

export default BookList;
