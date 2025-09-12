import styles from "./LoginRegister.module.css";
import { ErrorMessage, Field, Formik } from "formik";
import { loginUser, registerUser } from "../../store/Auth/authService.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // ✅ useState import
import { toast } from "react-toastify";
import * as yup from "yup";
import logo from "../../assets/Logo.png";
import mobileLogo from "../../assets/mobileLogo.png";
import hero from "../../assets/hero.png";
import heroMobile from "../../assets/mobileHero.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // ✅ React icons import

const LoginRegister = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [showPassword, setShowPassword] = useState(false); // ✅ Show password state

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
              <img className={styles.desktopLogo} src={logo} alt="Logo" />
              <img
                className={styles.mobileLogo}
                src={mobileLogo}
                alt="Mobile Logo"
              />
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
                      <div className={styles.registerInputs}>
                        <ErrorMessage
                          className={styles.errorMessage}
                          name="name"
                          component="div"
                        />
                        <div className={styles.inputContainer}>
                          <span className={styles.subtitle}>Name:</span>
                          <Field
                            type="text"
                            name="name"
                            className={styles.field}
                            placeholder="Name"
                            onChange={handleChange}
                            value={values.name}
                          />
                        </div>

                        <ErrorMessage
                          className={styles.errorMessage}
                          name="email"
                          component="div"
                        />
                        <div className={styles.inputContainer}>
                          <span className={styles.subtitle}>Email:</span>
                          <Field
                            type="email"
                            name="email"
                            className={styles.field}
                            placeholder="Email"
                            onChange={handleChange}
                            value={values.email}
                          />
                        </div>

                        <ErrorMessage
                          className={styles.errorMessage}
                          name="password"
                          component="div"
                        />
                        <div className={styles.passwordContainer}>
                          <div className={styles.inputContainer}>
                            <span className={styles.subtitle}>Password:</span>
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className={styles.field}
                              placeholder="Password"
                              onChange={handleChange}
                              value={values.password}
                            />
                          </div>

                          {showPassword ? (
                            <AiOutlineEyeInvisible
                              className={styles.eyeIcon}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <AiOutlineEye
                              className={styles.eyeIcon}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                      </div>

                      <div className={styles.btnSectionRegister}>
                        <button
                          className={styles.registerBtn}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Register
                        </button>
                        <Link className={styles.btnSectionLink} to="/login">
                          {" "}
                          {/* ✅ Düzeltildi */}
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
                      <div className={styles.registerInputs}>
                        <ErrorMessage
                          className={styles.errorMessage}
                          name="email"
                          component="div"
                        />
                        <div className={styles.inputContainer}>
                          <span className={styles.subtitle}>Email:</span>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={styles.field}
                            onChange={handleChange}
                            value={values.email}
                          />
                        </div>

                        <ErrorMessage
                          className={styles.errorMessage}
                          name="password"
                          component="div"
                        />
                        <div className={styles.passwordContainer}>
                          <div className={styles.inputContainer}>
                            <span className={styles.subtitle}>Password:</span>
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Password"
                              className={styles.field}
                              onChange={handleChange}
                              value={values.password}
                            />
                          </div>

                          {showPassword ? (
                            <AiOutlineEyeInvisible
                              className={styles.eyeIcon}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <AiOutlineEye
                              className={styles.eyeIcon}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                      </div>

                      <div className={styles.btnSectionLogin}>
                        <button
                          className={styles.loginBtn}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Login
                        </button>
                        <Link className={styles.btnSectionLink} to="/register">
                          {" "}
                          {/* ✅ Düzeltildi */}
                          Don't have an account?
                        </Link>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </div>
          </div>
          <div className={styles.rightSection}>
            <img className={styles.heroImage} src={hero} alt="Hero" />
            <img
              className={styles.heroMobileImage}
              src={heroMobile}
              alt="Hero Mobile"
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default LoginRegister;
