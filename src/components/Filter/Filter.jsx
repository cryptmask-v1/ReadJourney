import React from "react";
import styles from "./Filter.module.css";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import book from "../../assets/book.png";

const Filter = () => {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Filters:</h2>
        <Formik
          initialValues={{ book: "", author: "" }}
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

              <button className={styles.button} type="submit">
                To Apply
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className={styles.workoutContainer}>
        <h3 className={styles.workoutTitle}>Start your workout</h3>
        <div className={styles.list}>
          <div className={styles.listItemContainer}>
            <div className={styles.listItem}>1</div>
            <h4 className={styles.listText}>
              <span>Create a personal library:</span>
              add the books you intend to read to it.
            </h4>
          </div>
          <div className={styles.listItemContainer}>
            <div className={styles.listItem}>2</div>
            <h4 className={styles.listText}>
              <span>Create your first workout:</span>
              define a goal, choose a period, start training.
            </h4>
          </div>
        </div>
        <div className={styles.linkContainer}>
          <Link className={styles.link} to="/Library">
            My Library
          </Link>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <img src={book} alt="book" className={styles.bottomImg} />
        <p className={styles.bottomText}>
          "Books are <span>windows</span> to the world, and reading is a journey
          into the unknown."
        </p>
      </div>
    </div>
  );
};

export default Filter;
