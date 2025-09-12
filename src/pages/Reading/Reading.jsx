import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import MyReadingsFilter from "../../components/MyReadingsFilter/MyReadingsFilter";
import styles from "./Reading.module.css";
import start from "../../assets/start.png";
import bookskeleton from "../../assets/bookskeletonlarge.png";

const Reading = ({ book }) => {
  const location = useLocation();
  const { state } = location;
  const bookData = state?.book || book;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <MyReadingsFilter book={bookData} />
        <div className={styles.readingContainer}>
          <h1 className={styles.readingTitle}>Reading Page</h1>
          <img
            className={styles.bookImage}
            src={bookData?.imageUrl || bookskeleton}
            alt={bookData?.title}
          />
          <h2 className={styles.bookTitle}>{bookData?.title}</h2>
          <p className={styles.bookAuthor}>{bookData?.author}</p>

          <div>
            <img src={start} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reading;
