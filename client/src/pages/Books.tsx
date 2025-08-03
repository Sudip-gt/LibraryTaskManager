import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { loadBooks, borrowBookById, returnBookById } from '../redux/books/bookSlice';

const Books: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);
  const token = localStorage.getItem('accessToken') || '';


  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  const handleBorrow = (bookId: string) => {
    dispatch(borrowBookById({ bookId, token }));
  };

  const handleReturn = (bookId: string) => {
    dispatch(returnBookById({ bookId, token }));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">📚 Library Books</h2>

      {loading && <p className="text-blue-500 text-center">Loading books...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
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
                onClick={() => handleBorrow(book._id)}
                className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition"
              >
                Borrow
              </button>
            )}
            {book.isBorrowed && (
              <button
                onClick={() => handleReturn(book._id)}
                className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition"
              >
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
