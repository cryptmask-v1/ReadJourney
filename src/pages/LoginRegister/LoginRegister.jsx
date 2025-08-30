import React from "react";
import styles from "./LoginRegister.module.css";
import { Formik } from "formik";

const LoginRegister = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <div className={styles.leftSection}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </Formik>
        </div>
        <div className={styles.rightSection}></div>
      </div>
    </div>
  );
};

export default LoginRegister;
