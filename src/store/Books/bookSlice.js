import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    addBook: (state, action) => {
      state.list.push(action.payload);
    },
    removeBook: (state, action) => {
      state.list = state.list.filter((book) => book.id !== action.payload.id);
    },
    setBooks: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { addBook, removeBook, setBooks } = bookSlice.actions;
export default bookSlice.reducer;
