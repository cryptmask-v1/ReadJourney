import React, { useEffect, useState } from "react";
import styles from "./RecommendedBooks.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedBooks } from "../../store/Books/bookService";

const RecommendedBooks = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    dispatch(
      fetchRecommendedBooks({
        title: "",
        author: "",
        page: pagination.page,
        limit: 10,
      })
    );
  }, [dispatch, pagination]);
  const recommendedBooks = useSelector(
    (state) => state.books.recommendedBooks.results
  );

  return (
    <div className={styles.container}>
      {/* Book list would be rendered here */}
      <div>
        <div>
          <h2 className={styles.title}>Recommended</h2>
          {/* <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
          >
            Next
          </button> */}
        </div>

        <div className={styles.bookListContainer}>
          <ul className={styles.bookList}>
            {recommendedBooks && recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <li key={book._id} className={styles.bookItem}>
                  <img
                    className={styles.bookImage}
                    src={book.imageUrl}
                    alt={book.title}
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
    </div>
  );
};

export default RecommendedBooks;
