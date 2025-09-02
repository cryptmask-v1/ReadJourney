import {
  getRecommendedBooks,
  addBook,
  addBookFromRecommended,
  deleteBookFromUser,
  getUserBooks,
  startReadingBook,
  finishReadingBook,
  deleteReadingBook,
  getBookInfo,
} from "./bookApi";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRecommendedBooks = createAsyncThunk(
  "books/fetchRecommendedBooks",
  async (params, { rejectWithValue }) => {
    try {
      const { title, author, page = 1, limit = 10 } = params;
      const response = await getRecommendedBooks(title, author, page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const addBookToLibrary = createAsyncThunk(
  "books/addBookToLibrary",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await addBook(bookData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const addBookFromRecommendedToLibrary = createAsyncThunk(
  "books/addBookFromRecommended",
  async (id, { rejectWithValue }) => {
    try {
      const response = await addBookFromRecommended(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteBookFromLibrary = createAsyncThunk(
  "books/deleteBookFromLibrary",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteBookFromUser(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getCurrentUserBooks = createAsyncThunk(
  "books/getUserBooks",
  async (status = "", { rejectWithValue }) => {
    try {
      const response = await getUserBooks(status);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const startReading = createAsyncThunk(
  "books/startReading",
  async (params, { rejectWithValue }) => {
    try {
      const response = await startReadingBook(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const finishReading = createAsyncThunk(
  "books/finishReading",
  async (params, { rejectWithValue }) => {
    try {
      const response = await finishReadingBook(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteReading = createAsyncThunk(
  "books/deleteReading",
  async (params, { rejectWithValue }) => {
    try {
      const response = await deleteReadingBook(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchBookInfo = createAsyncThunk(
  "books/fetchBookInfo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getBookInfo(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
