import API from './axiosInstance';

export const createReturnTask = async (bookId: string) => {
  const res = await API.post('/tasks/return-task', { bookId });
  return res.data;
};
