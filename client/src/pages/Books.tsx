import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { loadBooks, returnBookById, startCheckoutSession } from '../redux/books/bookSlice';
import BookList from '../components/books/BookList';
import SearchBar from '../components/books/SearchBar';
import toast from 'react-hot-toast';

const Books: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);
  const token = localStorage.getItem('accessToken') || '';
  const isLoggedIn = !!token;

  const [searchTerm, setSearchTerm] = useState('');
  const [loginErrorShownFor, setLoginErrorShownFor] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  const handleBorrow = async (bookId: string) => {
    if (!isLoggedIn) {
      setLoginErrorShownFor(bookId);
      return;
    }
    // dispatch(borrowBookById({ bookId, token }));
    // setLoginErrorShownFor(null);
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
      dispatch(loadBooks());
    } catch (err) {
      console.error('Failed to return book:', err);
      toast.error('Failed to return book');
    }
  };


  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Library Books</h2>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading && <p className="text-blue-500 text-center">Loading books...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <BookList
        books={filteredBooks}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
        isLoggedIn={isLoggedIn}
        loginErrorShownFor={loginErrorShownFor}
      />
    </div>
  );
};

export default Books;

