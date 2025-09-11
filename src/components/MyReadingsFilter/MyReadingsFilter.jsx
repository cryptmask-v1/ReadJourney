import React from "react";
import styles from "./MyReadingsFilter.module.css";
import { Formik } from "formik";
import { Form, Field } from "formik";
import star from "../../assets/star.png";

const MyReadingsFilter = () => {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Start page:</h2>
        <Formik
          initialValues={{ pageNumber: "0" }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>Page number:</span>
                <Field
                  className={styles.field}
                  name="pageNumber"
                  placeholder="Enter text"
                />
              </div>

              <button className={styles.button} type="submit">
                To start
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className={styles.bottomSection}>
        <h2 className={styles.progressTitle}>Progress</h2>
        <p className={styles.progressText}>
          Here you will see when and how much you read. To record, click on the
          red button above.
        </p>

        <div className={styles.starsContainer}>
          <img className={styles.star} src={star} alt="star" />
        </div>
      </div>
    </div>
  );
};

export default MyReadingsFilter;
