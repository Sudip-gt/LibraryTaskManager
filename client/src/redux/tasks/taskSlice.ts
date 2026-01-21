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

import { returnBookById } from '../books/bookSlice';

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
      })
      .addCase(returnBookById.fulfilled, (state, action) => {
        const payload = action.payload as { bookId: string };
        const returnedBookId = payload?.bookId;

        if (returnedBookId) {
          state.tasks = state.tasks.filter(
            (task) =>
              task.relatedBook !== returnedBookId &&
              task.book !== returnedBookId &&
              task.bookId !== returnedBookId
          );
        }
      });
  },
});

export default taskSlice.reducer;
