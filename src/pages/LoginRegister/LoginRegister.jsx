import styles from "./LoginRegister.module.css";
import { Formik } from "formik";
import { loginUser, registerUser } from "../../store/Auth/authService.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate("/recommended");
    }
  }, [token, navigate]);

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

  const handleRegister = async (values, { resetForm }) => {
    try {
      const result = await dispatch(registerUser(values)).unwrap();
      notify(result || "Registration successful", "success");
      resetForm();
      navigate("/recommended");
    } catch (error) {
      notify(error.message || "Registration failed", "error");
    }
  };

  const handleLogin = async (values, { resetForm }) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();

      const message = result?.message || "Login successful";

      notify(message, "success");
      resetForm();
      navigate("/recommended");
    } catch (error) {
      const message = error?.message || "Login failed";
      notify(message, "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <>
          <div className={styles.leftSection}>
            {location.pathname.includes("/register") && (
              <Formik
                key={location.pathname}
                initialValues={{ name: "", email: "", password: "" }}
                onSubmit={handleRegister}
              >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      value={values.name}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      to="/login"
                    >
                      Already have an account?
                    </Link>
                  </form>
                )}
              </Formik>
            )}
            {location.pathname.includes("/login") && (
              <Formik
                key={location.pathname}
                initialValues={{ email: "", password: "" }}
                onSubmit={handleLogin}
              >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      value={values.email}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      to="/register"
                    >
                      Don't have an account?
                    </Link>
                  </form>
                )}
              </Formik>
            )}
          </div>
          <div className={styles.rightSection}></div>
        </>
      </div>
    </div>
  );
};

export default LoginRegister;
