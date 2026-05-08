import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import API from '../../api/axiosInstance';
import type { AuthState } from '../../types/auth';
import { fetchUser, loginUser, registerUser } from './authAPI';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

export const register = createAsyncThunk(
  'auth/register',
  async (formData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await registerUser(formData);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(formData);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const res = await fetchUser();
      return res.user;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load user');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // Even if server call fails, still clear local state
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
        state.initialized = true;
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      });
  },
});

export default authSlice.reducer;
