import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

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
