import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRecommendedBooks,
  addBookToLibrary,
  addBookFromRecommendedToLibrary,
  deleteBookFromLibrary,
  getCurrentUserBooks,
  startReading,
  finishReading,
  deleteReading,
  fetchBookInfo,
} from "./bookService";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    recommendedBooks: [],
    userBooks: [],
    currentBook: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
    },
  },
  extraReducers(builder) {
    builder
      // Fetch recommended books
      .addCase(fetchRecommendedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedBooks = action.payload.data || action.payload;
        // Pagination varsa handle et
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchRecommendedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add book to library
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.userBooks.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addBookToLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookToLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add book from recommended to library
      .addCase(addBookFromRecommendedToLibrary.fulfilled, (state, action) => {
        state.userBooks.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addBookFromRecommendedToLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookFromRecommendedToLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete book from library
      .addCase(deleteBookFromLibrary.fulfilled, (state, action) => {
        state.userBooks = state.userBooks.filter(
          (book) => book.id !== action.payload.id
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBookFromLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookFromLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get current user books
      .addCase(getCurrentUserBooks.fulfilled, (state, action) => {
        state.userBooks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCurrentUserBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start reading
      .addCase(startReading.fulfilled, (state, action) => {
        const book = state.userBooks.find(
          (book) => book.id === action.payload.id
        );
        if (book) {
          book.status = "reading";
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(startReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Finish reading
      .addCase(finishReading.fulfilled, (state, action) => {
        const book = state.userBooks.find(
          (book) => book.id === action.payload.id
        );
        if (book) {
          book.status = "finished";
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(finishReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finishReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete reading
      .addCase(deleteReading.fulfilled, (state, action) => {
        const book = state.userBooks.find(
          (book) => book.id === action.payload.id
        );
        if (book) {
          book.status = "not started";
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch book info
      .addCase(fetchBookInfo.fulfilled, (state, action) => {
        state.currentBook = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBookInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
