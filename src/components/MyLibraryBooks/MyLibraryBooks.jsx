import styles from "./MyLibraryBooks.module.css";
import { Formik, Form, Field } from "formik";
import book from "../../assets/book.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { getCurrentUserBooks } from "../../store/Books/bookService";
import bookskeleton from "../../assets/bookskeleton.png";
import deleteicon from "../../assets/deleteicon.svg";
import { deleteBookFromLibrary } from "../../store/Books/bookService";

import { notify } from "../Notify/Notify";

const MyLibraryBooks = () => {
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterValue, setFilterValue] = useState("");
  useEffect(() => {
    if (filterStatus) {
      dispatch(getCurrentUserBooks(filterStatus));
    } else {
      dispatch(getCurrentUserBooks());
    }
  }, [dispatch, filterStatus]);

  const ownBooks = useSelector((state) => state.books.userBooks);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = (book) => {
    dispatch(deleteBookFromLibrary(book._id));
    notify("Book deleted from your library", "success");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>My Library</h2>
          <Formik initialValues={{ status: "" }}>
            <Form className={styles.form}>
              <Field
                as="select"
                className={styles.field}
                name="status"
                value={filterValue}
                placeholder="Enter text"
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setFilterValue(e.target.value);
                }}
              >
                <option value="">All Books</option>
                <option value="unread">Unread</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </Field>
            </Form>
          </Formik>
        </div>

        <div className={styles.bookListContainer}>
          <ul className={styles.bookList}>
            {ownBooks && ownBooks.length > 0 ? (
              ownBooks.map((book) => (
                <li key={book._id} className={styles.bookItem}>
                  {book.imageUrl ? (
                    <img
                      className={styles.bookImage}
                      src={book.imageUrl}
                      alt={book.title}
                      onClick={() => handleBookClick(book)}
                    />
                  ) : (
                    <img
                      className={styles.bookImage}
                      src={bookskeleton}
                      alt={book.title}
                      onClick={() => handleBookClick(book)}
                    />
                  )}
                  <div className={styles.bookInfo}>
                    <div className={styles.bookText}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                    </div>
                    <img
                      className={styles.deleteIcon}
                      src={deleteicon}
                      alt="Delete"
                      onClick={() => handleDeleteBook(book)}
                    />
                  </div>
                  <div className={styles.statusContainer}></div>
                </li>
              ))
            ) : (
              <div className={styles.box}>
                <div className={styles.imageContainer}>
                  <img src={book} alt="Book" className={styles.image} />
                </div>
                <div className={styles.info}>
                  <p className={styles.text}>
                    To start training, add <span>some of your books</span> or
                    from the recommended ones
                  </p>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
      <Modal
        variant={"mybooks"}
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MyLibraryBooks;
