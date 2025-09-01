import React from "react";
import { logoutUser } from "../../store/Auth/authService";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Recommended = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notify = (message, type) => {
    if (!message) return;
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      notify("Logout successful", "success");
      navigate("/login");
    } catch (error) {
      notify(error.message || "Logout failed", "error");
    }
  };
  return (
    <div>
      <p style={{ color: "white" }}>Recommended Books</p>
      <button onClick={handleLogout}>ÇIKIŞ YAP</button>
    </div>
  );
};

export default Recommended;
