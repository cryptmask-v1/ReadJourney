import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import styles from "./MyLibraryFilter.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addBookToLibrary } from "../../store/Books/bookService";
import { GoArrowRight } from "react-icons/go";
import Modal from "../Modal/Modal";

const MyLibraryFilter = () => {
  const dispatch = useDispatch();
  const recommendedBooks = useSelector(
    (state) => state.books.recommendedBooks.results
  );
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [randomBooks, setRandomBooks] = useState([]);

  function getRandomBooks(books, count = 3) {
    if (!Array.isArray(books) || books.length === 0) return [];
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  useEffect(() => {
    if (recommendedBooks && recommendedBooks.length > 0) {
      setRandomBooks(getRandomBooks(recommendedBooks, 3));
    }
  }, [recommendedBooks]);

  const handleAddBook = (values) => {
    dispatch(
      addBookToLibrary({
        title: values.book,
        author: values.author,
        totalPages: values.totalPages,
      })
    );
  };
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };
  const handleAddToLibrary = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Create your library:</h2>
        <Formik
          initialValues={{ book: "", author: "", totalPages: "" }}
          onSubmit={(values) => handleAddBook(values)}
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
                  name="totalPages"
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
        <h2 className={styles.bottomTitle}>Recommended books</h2>
        <ul className={styles.bottomList}>
          {randomBooks.map((book) => (
            <li
              className={styles.bottomItem}
              key={book._id}
              onClick={() => handleBookClick(book)}
            >
              <img
                className={styles.bottomImage}
                src={book.imageUrl}
                alt={book.title}
              />
              <div className={styles.bookInfo}>
                <p className={styles.bookTitle}>{book.title}</p>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.linkContainer}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <GoArrowRight className={styles.arrowIcon} />
        </div>
      </div>
      <Modal
        variant={"recommended"}
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToLibrary={handleAddToLibrary}
      />
    </div>
  );
};

export default MyLibraryFilter;
