import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "./usersApi";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrent",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const data = await getCurrentUser(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
