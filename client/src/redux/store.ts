import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import bookReducer from './books/bookSlice'
import taskReducer from './tasks/taskSlice'

const loadTaskFromStorage = () => {
  try {
    const taskState = localStorage.getItem('taskState');
    return taskState ? { tasks: JSON.parse(taskState) } : {};
  } catch {
    return {};
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    tasks: taskReducer,
  },
  preloadedState: loadTaskFromStorage(),
});

store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('taskState', JSON.stringify(state.tasks));
  } catch {
    console.error('Failed to save task state to local storage');
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
