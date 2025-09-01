import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, register } from "../../services/authApi";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      // set global header right after successful register
      if (response?.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await login(userData);
      // set global header right after successful login
      if (response?.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// logoutUser stays (client cleanup in finally is fine)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await logout();
  } catch (error) {
    console.warn("logout API error (ignored):", error?.response ?? error);
  } finally {
    delete axios.defaults.headers.common["Authorization"];
    try {
      localStorage.removeItem("persist:root");
    } catch (error) {
      error.response?.data || { message: error.message };
    }
  }
  return;
});
