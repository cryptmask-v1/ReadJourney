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

  // ✅ Redux state'ten bookData'yı al (öncelikli)
  const reduxBookData = useSelector((state) => state.books.currentBook);
  const bookData = reduxBookData || state?.book || book;

  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  console.log("bookData._id:", bookData?._id);
  // ✅ fetchBookInfo çağrısını güvenli hale getir
  useEffect(() => {
    if (!bookData) return;
    const id = bookData?._id;
    if (!id) return;
    // Eğer redux'taki currentBook zaten aynı id ise yeniden fetch etme
    if (reduxBookData && reduxBookData._id === id) return;

    dispatch(fetchBookInfo(id))
      .unwrap()
      .catch((error) => {
        // axios hatası veya rejectWithValue ile gelen info'y kontrol et
        const status =
          error?.status || error?.response?.status || error?.statusCode;
        if (
          status === 404 ||
          (error?.message && error.message.toLowerCase().includes("not found"))
        ) {
          /* Lines 47-51 omitted */
        } else {
          /* Lines 52-53 omitted */
        }
      });
  }, [dispatch, bookData?._id, reduxBookData?._id]);
  // ✅ Progress array'ini takip et ve state güncelle
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

  console.log("bookData._id:", bookData?._id);
  // ✅ fetchBookInfo çağrısını güvenli hale getir
  useEffect(() => {
    const id = bookData?._id;
    if (!id) return;
    // Eğer redux'taki currentBook zaten aynı id ise yeniden fetch etme
    if (reduxBookData && reduxBookData._id === id) return;

    dispatch(fetchBookInfo(id))
      .unwrap()
      .catch((error) => {
        // axios hatası veya rejectWithValue ile gelen info'yu kontrol et
        const status =
          error?.status || error?.response?.status || error?.statusCode;
        if (
          status === 404 ||
          (error?.message && error.message.toLowerCase().includes("not found"))
        ) {
          // Redux slice üzerinden temizleme action'ınız varsa onu dispatch edin,
          // yoksa doğrudan setCurrentBook action tipi ile temizleyin
          dispatch({ type: "books/setCurrentBook", payload: null });
          console.warn("fetchBookInfo 404: currentBook temizlendi");
        } else {
          console.error("fetchBookInfo error:", error);
        }
      });
  }, [dispatch, bookData?._id, reduxBookData?._id]);
  // ✅ Progress array'ini takip et ve state güncelle
  useEffect(() => {
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

  // ✅ Yüzdelik hesabı fonksiyonu (ondalık ile)
  const calculatePercentage = (entry) => {
    const pagesRead =
      entry.status === "active"
        ? entry.startPage
        : entry.finishPage - entry.startPage;
    const totalPages = bookData?.totalPages || 1; // Güvenli fallback
    const percentage = (pagesRead / totalPages) * 100;
    return percentage.toFixed(2); // ✅ 0.00 formatında
  };

  // ✅ Süre hesabı fonksiyonu (dakika olarak)
  const calculateDurationMinutes = (entry) => {
    if (entry.status === "active") return "Ongoing";
    const start = new Date(entry.startReading);
    const finish = new Date(entry.finishReading);
    const diffMs = finish - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Milisaniyeyi dakikaya çevir
    return `${diffMinutes} minutes`;
  };

  // ✅ Bugünkü tarihi al
  const today = new Date().toLocaleDateString();

  // ✅ Progress'i tarihe göre grupla
  const groupedProgress =
    bookData?.progress?.reduce((groups, entry) => {
      const date = new Date(entry.startReading).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {}) || {};

  // ✅ Tarih için toplam okunan sayfa hesabı
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
            if (isReading) {
              dispatch(
                finishReading({ id: bookData?._id, page: values.pageNumber })
              );
            } else {
              dispatch(
                startReading({ id: bookData?._id, page: values.pageNumber })
              );
            }
          }}
        >
          {() => (
            <Form className={styles.form}>
              <div className={styles.inputContainer}>
                <span className={styles.subtitle}>
                  {isReading ? "Current page:" : "Start page:"}
                </span>
                <Field className={styles.field} name="number" />
              </div>
              <button className={styles.button} type="submit">
                {isReading ? "To stop" : "To start"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {bookData?.progress?.length === 0 ? (
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
                  {/* ✅ Aktif/inactive ikonu */}
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

                      {/* ✅ Süre göster */}
                      <div className={styles.pagesSection}>
                        <img
                          className={styles.progressIcon}
                          src={progress}
                          alt="progress"
                        />
                        <p className={styles.pages}>
                          {(entry.status === "active"
                            ? entry.startPage
                            : entry.finishPage) - entry.startPage}{" "}
                          pages per hour
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
