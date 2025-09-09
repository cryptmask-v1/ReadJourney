import React from "react";
import styles from "./MyLibraryBooks.module.css";
import { Formik, Form, Field } from "formik";
import book from "../../assets/book.png";

const MyLibraryBooks = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>My Library</h2>
          <Formik
            initialValues={{ status: "" }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form className={styles.form}>
              <Field
                as="select"
                className={styles.field}
                name="status"
                placeholder="Enter text"
              >
                <option value="">All Books</option>
                <option value="unread">Unread</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </Field>
            </Form>
          </Formik>
        </div>

        <div className={styles.box}>
          <div className={styles.imageContainer}>
            <img src={book} alt="Book" className={styles.image} />
          </div>
          <div className={styles.info}>
            <p className={styles.text}>
              To start training, add <span>some of your books</span> or from the
              recommended ones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLibraryBooks;
