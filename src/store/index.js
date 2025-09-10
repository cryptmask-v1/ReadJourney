import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice.js";
import bookReducer from "./Books/bookSlice.js";
import userReducer from "../store/Users/userSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import axios from "axios"; // Axios import ekle
import { refreshUser } from "./Auth/authService.js"; // RefreshUser thunk import

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "books"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  books: bookReducer,
  users: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Axios interceptor - 401 için auto refresh
axios.interceptors.response.use(
  (response) => response, // Success response'ları olduğu gibi geçir
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Infinite loop önleme

      try {
        // Refresh token ile yeni token al
        await store.dispatch(refreshUser());

        // Store'dan yeni token al
        const newToken = store.getState().auth.token;

        if (newToken) {
          // Original request'i yeni token ile tekrarla
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh başarısız olursa logout yap
        // store.dispatch(logoutUser()); // İsteğe bağlı
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const persistor = persistStore(store);
