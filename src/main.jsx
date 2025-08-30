import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "./store/Auth/authService.js";
import axios from "axios";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
          onBeforeLift={() => {
            const token = store.getState().auth?.token;
            if (token) {
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${token}`;
            }
          }}
        >
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);

// development helper (geçici): tarayıcı konsolundan store'a eriş

// window.store = store;
// window.loginUser = loginUser;
// window.registerUser = registerUser;
// window.logoutUser = logoutUser;
// window.persistor = persistor;

// Bu satırı production'a geçmeden önce sil.
