import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createBook, deleteBook, loadBooks, updateBook } from '../redux/books/bookSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import type { Book } from '../types/book';

interface BookFormData {
  title: string;
  author: string;
  description: string;
  borrowFee: string;
}

const emptyForm: BookFormData = { title: '', author: '', description: '', borrowFee: '' };

const AdminBooks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, page, totalPages, search } = useAppSelector((state) => state.books);

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(loadBooks({ page, search }));
  }, [dispatch, page, search]);

  const openCreate = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      borrowFee: String(book.borrowFee),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fee = parseFloat(form.borrowFee);
    if (!form.title.trim() || !form.author.trim() || isNaN(fee) || fee <= 0) {
      toast.error('Please fill all required fields with valid values');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBook) {
        await dispatch(updateBook({
          bookId: editingBook._id,
          data: { title: form.title.trim(), author: form.author.trim(), description: form.description.trim(), borrowFee: fee },
        })).unwrap();
        toast.success('Book updated');
      } else {
        await dispatch(createBook({
          title: form.title.trim(),
          author: form.author.trim(),
          description: form.description.trim() || undefined,
          borrowFee: fee,
        })).unwrap();
        toast.success('Book created');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingBook(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteBook(book._id)).unwrap();
      toast.success('Book deleted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Books</h2>
        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Book
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h3>

            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Title *</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 block w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Author *</span>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="mt-1 block w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Borrow Fee ($) *</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.borrowFee}
                onChange={(e) => setForm({ ...form, borrowFee: e.target.value })}
                className="mt-1 block w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingBook(null); }}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Saving...' : editingBook ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Book Table */}
      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Author</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Fee</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Status</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-medium">{book.title}</td>
                  <td className="border border-gray-200 px-4 py-2">{book.author}</td>
                  <td className="border border-gray-200 px-4 py-2 text-right">${book.borrowFee.toFixed(2)}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${book.isBorrowed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {book.isBorrowed ? 'Borrowed' : 'Available'}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(book)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        disabled={book.isBorrowed}
                        className="text-red-600 hover:text-red-800 font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        title={book.isBorrowed ? 'Cannot delete a borrowed book' : 'Delete book'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => dispatch(loadBooks({ page: page - 1, search }))}
            disabled={page <= 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => dispatch(loadBooks({ page: page + 1, search }))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
