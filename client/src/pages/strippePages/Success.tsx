
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axiosInstance';
import { useAppSelector } from '../../redux/hook';
import type { Book } from '../../types/book.d';
import type { Task } from '../../types/task';

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const user = useAppSelector((state) => state.auth.user);

  const [book, setBook] = useState<Book | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const verifyAttempted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || verifyAttempted.current) return;
      verifyAttempted.current = true;

      try {
        const res = await API.get(`/stripe/verify-session?session_id=${sessionId}`);
        setBook(res.data.book);
        setTask(res.data.task);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Invalid page</h1>
        <p className="text-gray-600 mt-2">No payment session found.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Payment verification failed</h1>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 text-center space-y-4">
      <h1 className="text-3xl font-semibold text-green-600">Payment Successful</h1>

      {user && (
        <p className="text-lg">
          Hello <strong>{user.name}</strong>, thank you for borrowing!
        </p>
      )}

      {book && (
        <div className="mt-4 border p-4 rounded shadow text-left bg-white">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-700">Author: {book.author}</p>
          <p className="text-sm text-gray-500 mt-2">Fee: ${book.borrowFee}</p>
        </div>
      )}

      {task && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4 shadow">
          <h3 className="font-semibold text-blue-700">Task Created:</h3>
          <p className="text-sm mt-1">{task.title}</p>
          <p className="text-xs text-gray-600">Due: {new Date(task.dueDate).toDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default Success;
