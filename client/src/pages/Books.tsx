import React, { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import BookList from '../components/books/BookList';
import SearchBar from '../components/books/SearchBar';
import { loadBooks, returnBookById, setPage, setSearch, startCheckoutSession } from '../redux/books/bookSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';

const Books: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error, page, totalPages, search } = useAppSelector((state) => state.books);
  const token = localStorage.getItem('accessToken') || '';
  const isLoggedIn = !!token;

  const [loginErrorShownFor, setLoginErrorShownFor] = React.useState<string | null>(null);
  const [localSearch, setLocalSearch] = React.useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearch(value));
    }, 400);
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadBooks({ page, search }));
  }, [dispatch, page, search]);

  const handleBorrow = async (bookId: string) => {
    if (!isLoggedIn) {
      setLoginErrorShownFor(bookId);
      return;
    }
    try {
      const resultAction = await dispatch(startCheckoutSession({ bookId }));
      const url = resultAction.payload as string;
      window.location.href = url;
    } catch (error) {
      console.error('Failed to start checkout session', error);
    }
  };

  const handleReturn = async (bookId: string) => {
    if (!isLoggedIn) {
      setLoginErrorShownFor(bookId);
      return;
    }

    try {
      await dispatch(returnBookById({ bookId, token })).unwrap();
      setLoginErrorShownFor(null);
      localStorage.removeItem(`taskCreatedFor-${bookId}`);
      toast.success('Book returned successfully');
      dispatch(loadBooks({ page, search }));
    } catch (err) {
      console.error('Failed to return book:', err);
      toast.error('Failed to return book');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Library Books</h2>

      <SearchBar searchTerm={localSearch} onSearchChange={handleSearchChange} />

      {loading && <p className="text-blue-500 text-center">Loading books...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <BookList
        books={books}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
        isLoggedIn={isLoggedIn}
        loginErrorShownFor={loginErrorShownFor}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;

