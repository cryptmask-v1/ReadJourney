import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import { useDispatch } from "react-redux";
import { addBookFromRecommendedToLibrary } from "../../store/Books/bookService";
import { notify } from "../Notify/Notify";

const Modal = ({ book, isOpen, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, isOpen]);

  // ✅ Modal içinde API call yap
  const handleAddToLibrary = () => {
    dispatch(addBookFromRecommendedToLibrary(book._id)); // ✅ Sadece ID gönder
    onClose(); // ✅ Modal'ı kapat
    notify("Book added to library!", "success");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          src={book?.imageUrl}
          alt={book?.title}
          className={styles.modalImage}
        />
        <h2 className={styles.modalTitle}>{book?.title}</h2>
        <p className={styles.modalAuthor}>{book?.author}</p>
        <p className={styles.modalPages}>{book?.totalPages} pages</p>

        <button
          className={styles.addButton}
          onClick={handleAddToLibrary} // ✅ Local function kullan
        >
          Add to library
        </button>
      </div>
    </div>
  );
};

export default Modal;
