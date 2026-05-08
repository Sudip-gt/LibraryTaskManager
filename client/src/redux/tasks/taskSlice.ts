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
      const res = await API.get('/tasks/my-tasks');
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },
  {
    condition: (_, { getState }) => {
      const { tasks } = getState() as { tasks: TaskState };
      return !tasks.loading;
    },
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/tasks/${taskId}/toggle`);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle task');
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
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.tasks.findIndex((t) => t._id === updated._id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
      })
      .addCase(returnBookById.fulfilled, (state, action) => {
        const returnedBookId = action.payload;
        if (returnedBookId) {
          state.tasks = state.tasks.filter(
            (task) => task.relatedBook !== returnedBookId
          );
        }
      });
  },
});

export default taskSlice.reducer;
