import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, borrowBook, returnBook } from '../../api/bookAPI';
import type { BookState } from '../../types/book';
import { createCheckoutSession } from '../../api/stripeAPI';

const initialState: BookState = {
    books: [],
    tasks: [],
    loading: false,
    error: null,
};

export const loadBooks = createAsyncThunk('books/loadBooks', async () => {
    return await fetchBooks();
});

export const borrowBookById = createAsyncThunk(
    'books/borrow',
    async ({ bookId, token }: { bookId: string; token: string }) => {
        await borrowBook(bookId, token);
        return bookId;
    }
);

export const returnBookById = createAsyncThunk(
    'books/returnBook',
    async ({ bookId, token }: { bookId: string; token: string }) => {
        const res = await returnBook(bookId, token);
        return res;
    }
);

export const startCheckoutSession = createAsyncThunk(
  'books/startCheckoutSession',
  async ({ bookId }: { bookId: string }) => {
    const url = await createCheckoutSession(bookId);
    return url;
  }
);

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadBooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadBooks.fulfilled, (state, action) => {
                state.books = action.payload;
                state.loading = false;
            })
            .addCase(loadBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            .addCase(borrowBookById.fulfilled, (state, action) => {
                const book = state.books.find((b) => b._id === action.payload);
                if (book) {
                    book.isBorrowed = true;
                }
            })

            .addCase(returnBookById.fulfilled, (state, action) => {

                const book = state.books.find((b) => b._id === action.payload );
                if (book) {
                    book.isBorrowed = false;
                    book.borrowedBy = null;
                    book.borrowedAt = null;
                }
                state.tasks = state.tasks.filter(task => task.book !== action.payload);
            })
    },
});

export default bookSlice.reducer;
