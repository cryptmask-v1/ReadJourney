import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { useDispatch } from "react-redux";
import { addBookFromRecommendedToLibrary } from "../../store/Books/bookService";
import { notify } from "../Notify/Notify";
import { useNavigate } from "react-router-dom";
import bookskeleton from "../../assets/bookskeletonlarge.png";
import goodjob from "../../assets/goodjob.png";
import { IoClose } from "react-icons/io5";

const Modal = ({ book, isOpen, onClose, variant }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, isOpen]);

  const handleAddToLibrary = () => {
    dispatch(addBookFromRecommendedToLibrary(book._id));
    onClose();
    notify("Book added to library!", "success");
  };

  const handleStartReading = () => {
    onClose();
    Navigate(`/reading`, { state: { book } });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      {/* recommended modal */}
      {variant === "recommended" && (
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.closeBtn}>
            <IoClose className={styles.closeIcon} size={24} onClick={onClose} />
          </div>

          <img
            src={book?.imageUrl}
            alt={book?.title}
            className={styles.modalImage}
          />
          <h2 className={styles.modalTitle}>{book?.title}</h2>
          <p className={styles.modalAuthor}>{book?.author}</p>
          <p className={styles.modalPages}>{book?.totalPages} pages</p>

          <button className={styles.addButton} onClick={handleAddToLibrary}>
            Add to library
          </button>
        </div>
      )}
      {/* mybooks modal */}
      {variant === "mybooks" && (
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.closeBtn}>
            <IoClose className={styles.closeIcon} size={24} onClick={onClose} />
          </div>

          {book?.imageUrl ? (
            <img
              src={book?.imageUrl}
              alt={book?.title}
              className={styles.modalImage}
            />
          ) : (
            <img
              src={bookskeleton}
              alt={book?.title}
              className={styles.modalImage}
            />
          )}
          <h2 className={styles.modalTitle}>{book?.title}</h2>
          <p className={styles.modalAuthor}>{book?.author}</p>
          <p className={styles.modalPages}>{book?.totalPages} pages</p>

          <button className={styles.addButton} onClick={handleStartReading}>
            Start Reading
          </button>
        </div>
      )}
      {variant === "goodjob" && (
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.closeBtn}>
            <IoClose className={styles.closeIcon} size={24} onClick={onClose} />
          </div>

          <img src={goodjob} alt="Good Job!" />
          <h2 className={styles.gjTitle}>Good Job!</h2>
          <p className={styles.gjText}>
            Your book is now in <span>the library!</span> The joy knows no
            bounds and now you can start your training
          </p>
          <button className={styles.addButton} onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Modal;
