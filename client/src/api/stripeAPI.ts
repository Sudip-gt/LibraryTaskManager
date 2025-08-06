import API from './axiosInstance';

export const createCheckoutSession = async (bookId: string) => {
  const res = await API.post('/stripe/create-checkout-session', { bookId });
  return res.data.url;
};