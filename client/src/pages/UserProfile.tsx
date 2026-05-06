
import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { loadUser } from '../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import type { Book } from '../types/book';

interface HistoryItem {
  book: Book | null;
  dueDate: string;
  completed: boolean;
  isOverdue: boolean;
  fine: number;
}

interface FineItem {
  task: { _id: string; title: string; dueDate: string; relatedBook?: Book };
  daysOverdue: number;
  fine: number;
}

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [currentlyBorrowed, setCurrentlyBorrowed] = useState<Book[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fines, setFines] = useState<FineItem[]>([]);
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && !user.email) {
          await dispatch(loadUser());
        }

        const [historyRes, finesRes] = await Promise.all([
          API.get('/admin/my-history'),
          API.get('/admin/my-fines'),
        ]);
        setCurrentlyBorrowed(historyRes.data.currentlyBorrowed);
        setHistory(historyRes.data.history);
        setFines(finesRes.data.fines);
        setTotalFine(finesRes.data.totalFine);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, user]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p><span className="font-medium">Name:</span> {user?.name}</p>
        <p><span className="font-medium">Email:</span> {user?.email}</p>
        <p><span className="font-medium">Role:</span> <span className="capitalize">{user?.role}</span></p>
      </div>

      {/* Fines Summary */}
      {totalFine > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-700 mb-2">Outstanding Fines: ${totalFine}</h2>
          <ul className="space-y-2">
            {fines.map((f) => (
              <li key={f.task._id} className="text-sm text-red-600">
                {f.task.title} — {f.daysOverdue} days overdue (${f.fine})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Currently Borrowed */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-3">Currently Borrowed ({currentlyBorrowed.length})</h2>
        {currentlyBorrowed.length === 0 ? (
          <p className="text-gray-500">No books currently borrowed</p>
        ) : (
          <ul className="space-y-2">
            {currentlyBorrowed.map((book) => (
              <li key={book._id} className="border rounded p-3 flex justify-between">
                <div>
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Borrowed: {book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Borrow History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-3">Borrow History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No borrow history</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, idx) => (
              <li key={idx} className={`border rounded p-3 ${item.isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.book?.title || 'Unknown Book'}</p>
                    <p className="text-sm text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${item.completed ? 'text-green-600' : item.isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                      {item.completed ? '✓ Returned' : item.isOverdue ? `⚠ Overdue ($${item.fine})` : '○ Active'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
