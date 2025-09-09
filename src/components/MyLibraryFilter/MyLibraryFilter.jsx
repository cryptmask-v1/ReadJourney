import React from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import styles from "./MyLibraryFilter.module.css";

const MyLibraryFilter = () => {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Create your library:</h2>
        <Formik
          initialValues={{ book: "", author: "", pages: "" }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>Book Title:</span>
                <Field
                  className={styles.field}
                  name="book"
                  placeholder="Enter text"
                />
              </div>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>The author:</span>
                <Field
                  className={styles.field}
                  name="author"
                  placeholder="Enter text"
                />
              </div>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>Number of pages:</span>
                <Field
                  className={styles.field}
                  name="pages"
                  placeholder="Enter text"
                />
              </div>

              <button className={styles.button} type="submit">
                Add Book
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className={styles.bottomSection}>
        <h3 className={styles.bottomTitle}>Recommended Books</h3>
        <ul className={styles.bottomList}>
          <li className={styles.bottomText}>
            <span>The Great Gatsby</span> by F. Scott Fitzgerald
          </li>
          <li className={styles.bottomText}>
            <span>To Kill a Mockingbird</span> by Harper Lee
          </li>
          <li className={styles.bottomText}>
            <span>1984</span> by George Orwell
          </li>
        </ul>
        <Link to="/" className={styles.link}>
          Home
        </Link>
      </div>
    </div>
  );
};

export default MyLibraryFilter;
