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
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-gray-800 leading-tight">{book.title}</h3>
        <p className="text-sm text-gray-500 font-medium mt-1">by {book.author}</p>
      </div>

      <p className="text-gray-600 flex-grow mb-6 text-sm leading-relaxed">{book.description}</p>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Borrow Fee</span>
            <span className="text-lg font-bold text-gray-900">${book.borrowFee}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${book.isBorrowed ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
            {book.isBorrowed ? 'Borrowed' : 'Available'}
          </span>
        </div>

        {!book.isBorrowed && (
          <button
            onClick={() => onBorrow(book._id)}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 active:scale-95"
          >
            Borrow Book
          </button>
        )}
        {book.isBorrowed && (
          <button
            onClick={() => onReturn(book._id)}
            className="w-full bg-white text-red-600 border-2 border-red-100 py-2.5 rounded-lg font-semibold hover:bg-red-50 hover:border-red-200 focus:ring-4 focus:ring-red-100 transition-all duration-200 active:scale-95"
          >
            Return Book
          </button>
        )}

        {!isLoggedIn && showLoginError && (
          <p className="mt-3 text-xs text-red-500 text-center font-medium animate-pulse">
            Please log in to borrow books.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
