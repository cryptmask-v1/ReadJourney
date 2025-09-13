import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, refresh, register } from "./authApi";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);

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

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const response = await refresh(token);
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
