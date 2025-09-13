import "./App.css";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Library from "./pages/Library/Library";
import Reading from "./pages/Reading/Reading";
import { Navigate, Route, Routes } from "react-router-dom";
import Recommended from "./pages/Recommended/Recommended";
import ProtectedRoute from "./services/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/library" element={<Library />} />
          <Route path="/reading" element={<Reading />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
