import React, { useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../store/Users/userService.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/Auth/authService";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const { user, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

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
      dispatch({ type: "user/clearUser" });
      notify("Logout successful", "success");
      navigate("/login");
    } catch (error) {
      notify(error.message || "Logout failed", "error");
      dispatch({ type: "user/clearUser" });
      navigate("/login");
    }
  };
  const getIndicatorClass = (currentPath) => {
    switch (currentPath) {
      case "/recommended":
        return `${styles.activeIndicator} ${styles.homeIndicator}`;
      case "/library":
        return `${styles.activeIndicator} ${styles.libraryIndicator}`;
      default:
        return styles.activeIndicator;
    }
  };

  const renderNavItem = (path, label) => {
    const isActive = location.pathname === path;

    return (
      <div className={styles.navItem} key={path}>
        <Link
          className={
            isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks
          }
          to={path}
        >
          {label}
        </Link>
        {isActive && <div className={getIndicatorClass(path)}></div>}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <nav className={styles.navLinks}>
          {renderNavItem("/recommended", "Home")}
          {renderNavItem("/library", "My Library")}
        </nav>
        <div className={styles.userSection}>
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>Error loading user</span>
          ) : (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className={styles.userName}>{user?.name || "User"}</span>
            </div>
          )}
          <button className={styles.logOutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
