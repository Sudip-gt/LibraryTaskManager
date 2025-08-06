// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import API from '../../api/axiosInstance';
// import type { Task } from '../../types/task.d';

// interface TaskState {
//   task: Task | null;
//   loading: boolean;
//   error: string | null;
// }

// const savedTask = (() => {
//   try {
//     const raw = localStorage.getItem('task');
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// })();

// const initialState: TaskState = {
//   task: savedTask,
//   loading: false,
//   error: null,
// };

// export const createReturnTask = createAsyncThunk(
//   'tasks/createReturnTask',
//   async (bookId: string, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken') || '';
//       const res = await API.post(`/tasks/return-task`, { bookId }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (err: unknown) {
//       const error = err as { response: { data: { message: string } } };
//       return rejectWithValue(error.response?.data?.message || 'Task creation failed');
//     }
//   }
// );

// export const fetchTaskByBook = createAsyncThunk(
//   'tasks/fetchTaskByBook',
//   async (bookId: string, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('accessToken') || '';
//       const res = await API.get(`/tasks/by-book/${bookId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (err: unknown) {
//       const error = err as { response: { data: { message: string } } };
//       return rejectWithValue(error.response?.data?.message || 'Fetch task failed');
//     }
//   }
// );

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     clearTask: (state) => {
//       state.task = null;
//       state.error = null;
//       localStorage.removeItem('task');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createReturnTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createReturnTask.fulfilled, (state, action) => {
//         state.task = action.payload;
//         state.loading = false;
//         localStorage.setItem('task', JSON.stringify(action.payload));
//       })
//       .addCase(createReturnTask.rejected, (state, action) => {
//         state.error = action.payload as string;
//         state.loading = false;
//       })
//       .addCase(fetchTaskByBook.fulfilled, (state, action) => {
//         state.task = action.payload;
//         localStorage.setItem('task', JSON.stringify(action.payload));
//       });
//   },
// });

// export const { clearTask } = taskSlice.actions;
// export default taskSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';
import type { Task } from '../../types/task.d';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [], 
  loading: false,
  error: null,
};

export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken') || '';
      const res = await API.get('/tasks/my-tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default taskSlice.reducer;

