import React, { useEffect, useState } from "react";
import styles from "./RecommendedBooks.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedBooks } from "../../store/Books/bookService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Modal from "../Modal/Modal";

const RecommendedBooks = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState({ page: 1, limit: 10 });

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recommendedBooks = useSelector((state) => state.books.recommendedBooks);

  useEffect(() => {
    if (
      !recommendedBooks.results ||
      recommendedBooks.page !== currentPage.page
    ) {
      dispatch(
        fetchRecommendedBooks({
          title: "",
          author: "",
          page: currentPage.page,
          limit: currentPage.limit,
        })
      );
    }
  }, [dispatch, currentPage]);

  // ✅ Book click handler
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // ✅ Modal close handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // ✅ Add to library handler (şimdilik console.log)
  const handleAddToLibrary = (book) => {
    console.log("Adding to library:", book);
    setIsModalOpen(false);
    // TODO: API call eklenecek
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <h2 className={styles.title}>Recommended</h2>
          <div className={styles.pagination}>
            <button
              disabled={currentPage.page <= 1}
              className={styles.prevNextBtn}
              onClick={() =>
                setCurrentPage({ ...currentPage, page: currentPage.page - 1 })
              }
            >
              <FaChevronLeft className={styles.chevronIcon} />
            </button>
            <button
              className={styles.prevNextBtn}
              onClick={() =>
                setCurrentPage({ ...currentPage, page: currentPage.page + 1 })
              }
              disabled={currentPage.page >= recommendedBooks.totalPages}
            >
              <FaChevronRight className={styles.chevronIcon} />
            </button>
          </div>
        </div>

        <div className={styles.bookListContainer}>
          <ul className={styles.bookList}>
            {recommendedBooks.results && recommendedBooks.results.length > 0 ? (
              recommendedBooks.results.map((book) => (
                <li key={book._id} className={styles.bookItem}>
                  <img
                    className={styles.bookImage}
                    src={book.imageUrl}
                    alt={book.title}
                    onClick={() => handleBookClick(book)} // ✅ Click handler ekle
                    style={{ cursor: "pointer" }} // ✅ Cursor pointer
                  />
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className={styles.bookItem}>
                No recommended books available.
              </li>
            )}
          </ul>
        </div>
      </div>
      <Modal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToLibrary={handleAddToLibrary}
      />
    </div>
  );
};

export default RecommendedBooks;
