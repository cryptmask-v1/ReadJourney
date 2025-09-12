import React, { useEffect, useState } from "react";
import styles from "./MyReadingsFilter.module.css";
import { Formik } from "formik";
import { Form, Field } from "formik";
import star from "../../assets/star.png";
import { useLocation } from "react-router-dom";
import {
  startReading,
  finishReading,
  fetchBookInfo,
} from "../../store/Books/bookService";
import { useDispatch, useSelector } from "react-redux";
import progress from "../../assets/progress.png";
import activedate from "../../assets/activedate.png";
import inactivedate from "../../assets/inactivedate.png";

const MyReadingsFilter = ({ book }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;

  // Redux state'ten bookData'yı al
  const reduxBookData = useSelector((state) => state.books.currentBook);
  const bookData = reduxBookData || state?.book || book;

  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // SADECE prop olarak gelen book'un id'sini kullan
  useEffect(() => {
    const bookId = book?._id || state?.book?._id;
    if (!bookId) return;

    // Eğer redux'taki currentBook zaten aynı id ise yeniden fetch etme
    if (reduxBookData && reduxBookData._id === bookId) return;

    dispatch(fetchBookInfo(bookId))
      .unwrap()
      .catch((error) => {
        const status =
          error?.status || error?.response?.status || error?.statusCode;
        if (
          status === 404 ||
          (error?.message && error.message.toLowerCase().includes("not found"))
        ) {
          dispatch({ type: "books/setCurrentBook", payload: null });
          console.warn("fetchBookInfo 404: currentBook temizlendi");
        } else {
          console.error("fetchBookInfo error:", error);
        }
      });
  }, [dispatch, book?._id, state?.book?._id, reduxBookData]);

  // Progress array'ini takip et ve state güncelle
  useEffect(() => {
    if (!bookData) return;
    if (!bookData?.progress || bookData.progress.length === 0) {
      setIsReading(false);
      setCurrentPage(1);
      return;
    }

    const lastProgress = bookData.progress[bookData.progress.length - 1];

    if (lastProgress.status === "active") {
      setIsReading(true);
      setCurrentPage(lastProgress.startPage || 1);
    } else {
      setIsReading(false);
      setCurrentPage(lastProgress.finishPage || 1);
    }
  }, [bookData?.progress]);

  // Eğer kitap bulunamadıysa mesaj göster
  if (!bookData) {
    return (
      <div className={styles.container}>
        <div className={styles.bottomSection}>
          <h2 className={styles.diaryTitle}>Progress</h2>
          <p className={styles.diaryText}>
            Kitap bulunamadı veya silinmiş. Lütfen başka bir kitap seçin.
          </p>
        </div>
      </div>
    );
  }

  // Yüzdelik hesabı fonksiyonu
  const calculatePercentage = (entry) => {
    const pagesRead =
      entry.status === "active"
        ? entry.startPage
        : entry.finishPage - entry.startPage;
    const totalPages = bookData?.totalPages || 1;
    const percentage = (pagesRead / totalPages) * 100;
    return percentage.toFixed(1); // 0.0 formatında
  };

  // Süre hesabı fonksiyonu
  const calculateDurationMinutes = (entry) => {
    if (entry.status === "active") return "Ongoing";
    const start = new Date(entry.startReading);
    const finish = new Date(entry.finishReading);
    const diffMs = finish - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minutes`;
  };

  // Bugünkü tarihi al
  const today = new Date().toLocaleDateString();

  // Progress'i tarihe göre grupla
  const groupedProgress =
    bookData?.progress?.reduce((groups, entry) => {
      const date = new Date(entry.startReading).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {}) || {};

  // Tarih için toplam okunan sayfa hesabı
  const calculateTotalPagesForDate = (date) => {
    const entries = groupedProgress[date];
    return entries.reduce((total, entry) => {
      const pagesRead =
        entry.status === "active"
          ? entry.startPage
          : entry.finishPage - entry.startPage;
      return total + pagesRead;
    }, 0);
  };

  // Saatlik sayfa hesabı
  const calculatePagesPerHour = (entry) => {
    if (entry.status === "active") return "Reading...";

    const start = new Date(entry.startReading);
    const finish = new Date(entry.finishReading);
    const diffHours = (finish - start) / (1000 * 60 * 60); // saat cinsinden
    const pagesRead = entry.finishPage - entry.startPage;

    if (diffHours > 0) {
      const pagesPerHour = Math.round(pagesRead / diffHours);
      return `${pagesPerHour} pages per hour`;
    }

    return "0 pages per hour";
  };

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>
          {isReading ? "Current page:" : "Start page:"}
        </h2>
        <Formik
          enableReinitialize
          initialValues={{ pageNumber: currentPage }}
          onSubmit={(values) => {
            // Form submit'te bookData yerine kesin olan book id'sini kullan
            const bookId = book?._id || bookData?._id;
            if (isReading) {
              dispatch(finishReading({ id: bookId, page: values.pageNumber }));
            } else {
              dispatch(startReading({ id: bookId, page: values.pageNumber }));
            }
          }}
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>
                  {isReading ? "Current page:" : "Start page:"}
                </span>
                <Field
                  className={styles.field}
                  name="pageNumber"
                  type="number"
                />
              </div>
              <button className={styles.button} type="submit">
                {isReading ? "To stop" : "To start"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {!bookData?.progress || bookData.progress.length === 0 ? (
        <div className={styles.bottomSection}>
          <h2 className={styles.diaryTitle}>Progress</h2>
          <p className={styles.diaryText}>
            Here you will see when and how much you read. To record, click on
            the red button above.
          </p>
          <div className={styles.starsContainer}>
            <img className={styles.star} src={star} alt="star" />
          </div>
        </div>
      ) : (
        <div>
          <h2 className={styles.progressTitle}>Diary</h2>
          <ul className={styles.progressList}>
            {Object.keys(groupedProgress).map((date) => (
              <li key={date} className={styles.dateGroup}>
                <div className={styles.dateHeader}>
                  <div className={styles.dateSection}>
                    <img
                      className={styles.dateIcon}
                      src={date === today ? activedate : inactivedate}
                      alt={date === today ? "active date" : "inactive date"}
                    />
                    <p className={styles.dateText}>{date}</p>
                  </div>

                  <p className={styles.pagesText}>
                    {calculateTotalPagesForDate(date)} pages
                  </p>
                </div>
                <ul className={styles.entryList}>
                  {groupedProgress[date].map((entry, index) => (
                    <li key={index} className={styles.entryItem}>
                      <div className={styles.minutesSection}>
                        <p className={styles.percentage}>
                          {calculatePercentage(entry)}%
                        </p>
                        <p className={styles.duration}>
                          {calculateDurationMinutes(entry)}
                        </p>
                      </div>

                      <div className={styles.pagesSection}>
                        <img
                          className={styles.progressIcon}
                          src={progress}
                          alt="progress"
                        />
                        <p className={styles.pages}>
                          {calculatePagesPerHour(entry)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyReadingsFilter;
