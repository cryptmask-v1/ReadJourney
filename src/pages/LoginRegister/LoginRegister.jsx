import styles from "./LoginRegister.module.css";
import { ErrorMessage, Formik } from "formik";
import { loginUser, registerUser } from "../../store/Auth/authService.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import logo from "../../assets/logo.png";
import hero from "../../assets/loginregister.png";

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

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(7, "Password must be at least 7 characters")
      .required("Password is required"),
  });

  const registerSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(7, "Password must be at least 7 characters")
      .required("Password is required"),
  });

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
            <div className={styles.logoContainer}>
              <img src={logo} alt="Logo" />
            </div>
            <h2 className={styles.registerLoginTitle}>
              Expend your mind, reading <span>a book</span>
            </h2>
            <div className={styles.formContainer}>
              {location.pathname.includes("/register") && (
                <Formik
                  key={location.pathname}
                  initialValues={{ name: "", email: "", password: "" }}
                  validationSchema={registerSchema}
                  onSubmit={handleRegister}
                >
                  {({ values, handleChange, handleSubmit, isSubmitting }) => (
                    <form
                      className={styles.formSection}
                      onSubmit={handleSubmit}
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        value={values.name}
                      />
                      <ErrorMessage name="name" component="div" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={values.email}
                      />
                      <ErrorMessage name="email" component="div" />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={values.password}
                      />
                      <ErrorMessage name="password" component="div" />
                      <div className={styles.btnSection}>
                        <button
                          className={styles.registerBtn}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Register
                        </button>
                        <Link className={styles.btnSectionLink} to="/login">
                          Already have an account?
                        </Link>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
              {location.pathname.includes("/login") && (
                <Formik
                  key={location.pathname}
                  initialValues={{ email: "", password: "" }}
                  onSubmit={handleLogin}
                  validationSchema={loginSchema}
                >
                  {({ values, handleChange, handleSubmit, isSubmitting }) => (
                    <form
                      className={styles.formSection}
                      onSubmit={handleSubmit}
                    >
                      <ErrorMessage name="email" component="div" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={values.email}
                      />
                      <ErrorMessage name="password" component="div" />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={values.password}
                      />
                      <button
                        className={styles.loginBtn}
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Login
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
          </div>
          <div className={styles.rightSection}>
            <img src={hero} alt="Hero" />
          </div>
        </>
      </div>
    </div>
  );
};

export default LoginRegister;
