import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { borrowBook, createBookAPI, deleteBookAPI, fetchBooks, returnBook, updateBookAPI } from '../../api/bookAPI';
import { createCheckoutSession } from '../../api/stripeAPI';
import type { BookState } from '../../types/book';

const initialState: BookState = {
    books: [],
    tasks: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    total: 0,
    search: '',
};

export const loadBooks = createAsyncThunk(
    'books/loadBooks',
    async (params: { page?: number; search?: string } | undefined) => {
        return await fetchBooks({ page: params?.page, limit: 12, search: params?.search });
    }
);

export const createBook = createAsyncThunk(
    'books/createBook',
    async (data: { title: string; author: string; description?: string; borrowFee: number }) => {
        return await createBookAPI(data);
    }
);

export const updateBook = createAsyncThunk(
    'books/updateBook',
    async ({ bookId, data }: { bookId: string; data: Partial<{ title: string; author: string; description: string; borrowFee: number }> }) => {
        return await updateBookAPI(bookId, data);
    }
);

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (bookId: string) => {
        await deleteBookAPI(bookId);
        return bookId;
    }
);

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
        await returnBook(bookId, token);
        return bookId;
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
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadBooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadBooks.fulfilled, (state, action) => {
                state.books = action.payload.books;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.total = action.payload.total;
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
                const book = state.books.find((b) => b._id === action.payload);
                if (book) {
                    book.isBorrowed = false;
                    book.borrowedBy = null;
                    book.borrowedAt = null;
                }
                state.tasks = state.tasks.filter(task => task.relatedBook !== action.payload);
            })
            .addCase(createBook.fulfilled, (state, action) => {
                state.books.unshift(action.payload);
                state.total += 1;
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                const idx = state.books.findIndex((b) => b._id === action.payload._id);
                if (idx !== -1) state.books[idx] = action.payload;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((b) => b._id !== action.payload);
                state.total -= 1;
            });
    },
});

export const { setSearch, setPage } = bookSlice.actions;
export default bookSlice.reducer;
