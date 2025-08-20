// import { useSearchParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../redux/hook';
// import { borrowBookById } from '../../redux/books/bookSlice';
// import API from '../../api/axiosInstance';
// import type { Book } from '../../types/book.d';

// interface Task {
//   title: string;
//   dueDate: string;
// }

// const Success = () => {
//   const [params] = useSearchParams();
//   const bookId = params.get('bookId');
//   const dispatch = useAppDispatch();

//   const [book, setBook] = useState<Book | null>(null);
//   const [task, setTask] = useState<Task | null>(null);
//   const user = useAppSelector((state) => state.auth.user);

//   ///////////////////////////////////////// Mark book as borrowed
//   useEffect(() => {
//     const token = localStorage.getItem('accessToken') || '';
//     if (bookId) {
//       dispatch(borrowBookById({ bookId, token }));
//     }
//   }, [bookId, dispatch]);

//   ///////////////////////////////////////////Fetch book info
//   useEffect(() => {
//     const fetchBook = async () => {
//       if (bookId) {
//         try {
//           const res = await API.get(`/books/${bookId}`);
//           setBook(res.data);
//         } catch (error) {
//           console.error('Error fetching book:', error);
//         }
//       }
//     };
//     fetchBook();
//   }, [bookId]);

// ////////////////////////////////Only create task if not already done in localStorage
// useEffect(() => {
//   const createTask = async () => {
//     if (!bookId) return;

//     const alreadyCreated = localStorage.getItem(`taskCreatedFor-${bookId}`);
//     if (alreadyCreated) return;

//     try {
//       const token = localStorage.getItem('accessToken') || '';
//       const res = await API.post('/tasks/return-task', { bookId }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setTask(res.data);
//       localStorage.setItem(`taskCreatedFor-${bookId}`, 'true');
//     } catch (error) {
//       console.error('Error creating task:', error);
//     }
//   };

//   createTask();
// }, [bookId]);


// ///////////////////////////////////////Always fetch task on mount, even after refresh
// useEffect(() => {
//   const fetchTask = async () => {
//     if (!bookId) return;

//     try {
//       const token = localStorage.getItem('accessToken') || '';
//       const res = await API.get(`/tasks/by-book/${bookId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data) {
//         setTask(res.data);
//       }
//     } catch (error) {
//       console.error('Error fetching task:', error);
//     }
//   };

//   fetchTask();
// }, [bookId]);

//   return (
//     <div className="max-w-xl mx-auto mt-16 text-center space-y-4">
//       <h1 className="text-3xl font-semibold text-green-600">Payment Successful</h1>

//       {user && (
//         <p className="text-lg">
//           Hello <strong>{user.name}</strong>, thank you for borrowing!
//         </p>
//       )}

//       {book ? (
//         <div className="mt-4 border p-4 rounded shadow text-left bg-white">
//           <h2 className="text-xl font-bold">{book.title}</h2>
//           <p className="text-gray-700">Author: {book.author}</p>
//           <p className="text-sm text-gray-500 mt-2">Fee: ${book.borrowFee}</p>
//         </div>
//       ) : (
//         <p className="text-gray-600 mt-4">Loading book details...</p>
//       )}

//       {task ? (
//         <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4 shadow">
//           <h3 className="font-semibold text-blue-700">Task Created:</h3>
//           <p className="text-sm mt-1">{task.title}</p>
//           <p className="text-xs text-gray-600">Due: {new Date(task.dueDate).toDateString()}</p>
//         </div>
//       ): (
//         <p className="text-gray-600 mt-4">No task created</p>
//       )}
//     </div>
//   );
// };

// export default Success;


//------------------------------------------------------------------------

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { borrowBookById } from '../../redux/books/bookSlice';
import API from '../../api/axiosInstance';
import type { Book } from '../../types/book.d';
import type { Task } from '../../types/task';

const Success = () => {
  const [params] = useSearchParams();
  const bookId = params.get('bookId');
  const dispatch = useAppDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  
  // Use refs to prevent duplicate API calls
  const taskCreationAttempted = useRef(false);
  const bookBorrowAttempted = useRef(false);

  ///////////////////////////////////////// Mark book as borrowed
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    if (bookId && !bookBorrowAttempted.current) {
      bookBorrowAttempted.current = true;
      dispatch(borrowBookById({ bookId, token }));
    }
  }, [bookId, dispatch]);

  ///////////////////////////////////////////Fetch book info
  useEffect(() => {
    const fetchBook = async () => {
      if (bookId) {
        try {
          const res = await API.get(`/books/${bookId}`);
          setBook(res.data);
        } catch (error) {
          console.error('Error fetching book:', error);
        }
      }
    };
    fetchBook();
  }, [bookId]);

  //////////////////////////////// Combined task handling effect
  useEffect(() => {
    const handleTask = async () => {
      if (!bookId || taskCreationAttempted.current || isCreatingTask) return;

      taskCreationAttempted.current = true;
      setIsCreatingTask(true);

      try {
        const token = localStorage.getItem('accessToken') || '';
        
        // First, try to fetch existing task
        try {
          const existingTaskRes = await API.get(`/tasks/by-book/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (existingTaskRes.data) {
            setTask(existingTaskRes.data);
            localStorage.setItem(`taskCreatedFor-${bookId}`, 'true');
            return;
          }
        } catch (error) {
          console.error('Error fetching existing task:', error);
        }

        // Check localStorage to prevent duplicate creation
        const alreadyCreated = localStorage.getItem(`taskCreatedFor-${bookId}`);
        if (alreadyCreated) return;

        // Create new task
        const createTaskRes = await API.post('/tasks/return-task', { bookId }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTask(createTaskRes.data);
        localStorage.setItem(`taskCreatedFor-${bookId}`, 'true');
        
      } catch (error) {
        console.error('Error handling task:', error);
        taskCreationAttempted.current = false; // Reset on error
      } finally {
        setIsCreatingTask(false);
      }
    };

    handleTask();
  }, [bookId]);

  return (
    <div className="max-w-xl mx-auto mt-16 text-center space-y-4">
      <h1 className="text-3xl font-semibold text-green-600">Payment Successful</h1>

      {user && (
        <p className="text-lg">
          Hello <strong>{user.name}</strong>, thank you for borrowing!
        </p>
      )}

      {book ? (
        <div className="mt-4 border p-4 rounded shadow text-left bg-white">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-gray-700">Author: {book.author}</p>
          <p className="text-sm text-gray-500 mt-2">Fee: ${book.borrowFee}</p>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">Loading book details...</p>
      )}

      {isCreatingTask ? (
        <p className="text-gray-600 mt-4">Creating return task...</p>
      ) : task ? (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4 shadow">
          <h3 className="font-semibold text-blue-700">Task Created:</h3>
          <p className="text-sm mt-1">{task.title}</p>
          <p className="text-xs text-gray-600">Due: {new Date(task.dueDate).toDateString()}</p>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No task found</p>
      )}
    </div>
  );
};

export default Success;
