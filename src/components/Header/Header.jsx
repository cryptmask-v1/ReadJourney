import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../store/Users/userService.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/Auth/authService";
import { notify } from "../Notify/Notify";
import mobileLogo from "../../assets/mobileLogo.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const { user, isLoading, error } = useSelector((state) => state.users);
  const [isOpen, setIsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className={styles.logo}>
          {screenWidth < 1024 ? (
            <Link to="/recommended">
              <img src={mobileLogo} alt="Mobile Logo" />
            </Link>
          ) : (
            <Link to="/recommended">
              <img src={logo} alt="Logo" />
            </Link>
          )}
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
          <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
      )}
      <div className={`${styles.burgerMenu} ${isOpen ? styles.open : ""}`}>
        <div className={styles.closeIcon} onClick={() => setIsOpen(false)}>
          <AiOutlineClose />
        </div>
        <nav className={styles.burgerNav}>
          <div className={styles.burgerNavItem}>
            <Link
              className={`${styles.burgerLink} ${
                location.pathname === "/recommended" ? styles.active : ""
              }`}
              to="/recommended"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {location.pathname === "/recommended" && (
              <div
                className={`${styles.activeIndicator} ${styles.homeIndicator}`}
              ></div>
            )}
          </div>
          <div className={styles.burgerNavItem}>
            <Link
              className={`${styles.burgerLink} ${
                location.pathname === "/library" ? styles.active : ""
              }`}
              to="/library"
              onClick={() => setIsOpen(false)}
            >
              My Library
            </Link>
            {location.pathname === "/library" && (
              <div
                className={`${styles.activeIndicator} ${styles.libraryIndicator}`}
              ></div>
            )}
          </div>
        </nav>
        <button
          className={styles.burgerLogout}
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Header;
