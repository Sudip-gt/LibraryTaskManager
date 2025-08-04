import React from 'react';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  borrowFee: number;
  isBorrowed: boolean;
}

interface BookCardProps {
  book: Book;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  isLoggedIn: boolean;
  showLoginError: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onBorrow,
  onReturn,
  isLoggedIn,
  showLoginError,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <p className="text-gray-700 mt-2">{book.description}</p>
      <p className="mt-2 text-sm">
        <span className="font-medium">Fee:</span> ${book.borrowFee}
      </p>
      <p className={`mt-1 text-sm ${book.isBorrowed ? 'text-red-500' : 'text-green-600'}`}>
        {book.isBorrowed ? 'Currently Borrowed' : 'Available'}
      </p>

      {!book.isBorrowed && (
        <button
          onClick={() => onBorrow(book._id)}
          className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition"
        >
          Borrow
        </button>
      )}
      {book.isBorrowed && (
        <button
          onClick={() => onReturn(book._id)}
          className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition"
        >
          Return
        </button>
      )}

      {!isLoggedIn && showLoginError && (
        <p className="mt-2 text-sm text-red-500">Please login first.</p>
      )}
    </div>
  );
};

export default BookCard;
