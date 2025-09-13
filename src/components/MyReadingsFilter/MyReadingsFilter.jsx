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
import Modal from "../Modal/Modal";
import piechartactive from "../../assets/piechartactive.svg";
import piechartpassive from "../../assets/piechartpassive.svg";
import hourglassactive from "../../assets/hourglassactive.svg";
import hourglasspassive from "../../assets/hourglasspassive.svg";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MyReadingsFilter = ({ book }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("diary");

  const reduxBookData = useSelector((state) => state.books.currentBook);
  const bookData = reduxBookData || state?.book || book;

  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const bookId = book?._id || state?.book?._id;
    if (!bookId) return;

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

  const calculatePercentage = (entry) => {
    const pagesRead =
      entry.status === "active"
        ? entry.startPage
        : entry.finishPage - entry.startPage;
    const totalPages = bookData?.totalPages || 1;
    const percentage = (pagesRead / totalPages) * 100;
    return percentage.toFixed(1);
  };

  const calculateDurationMinutes = (entry) => {
    if (entry.status === "active") return "Ongoing";
    const start = new Date(entry.startReading);
    const finish = new Date(entry.finishReading);
    const diffMs = finish - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minutes`;
  };

  const today = new Date().toLocaleDateString();

  const groupedProgress =
    bookData?.progress?.reduce((groups, entry) => {
      const date = new Date(entry.startReading).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {}) || {};

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

  const calculatePagesPerHour = (entry) => {
    if (entry.status === "active") return "Reading...";

    const pagesRead = entry.finishPage - entry.startPage;
    return `${pagesRead} pages read`;
  };

  const totalReadPages =
    bookData?.progress?.reduce((total, entry) => {
      const pagesRead =
        entry.status === "active"
          ? entry.startPage
          : entry.finishPage - entry.startPage;
      return total + pagesRead;
    }, 0) || 0;

  const totalPages = bookData?.totalPages || 1;
  const percentage = Math.round((totalReadPages / totalPages) * 100);

  const chartData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor:
          percentage === 100 ? ["#00ff00", "#1f1f1f"] : ["#00ff00", "#1f1f1f"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "80%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
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
            const bookId = book?._id || bookData?._id;
            if (isReading) {
              dispatch(
                finishReading({ id: bookId, page: values.pageNumber })
              ).then(() => {
                dispatch(fetchBookInfo(bookId));

                if (values.pageNumber >= (bookData?.totalPages || 1)) {
                  setModalOpen(true);
                }
              });
            } else {
              dispatch(
                startReading({ id: bookId, page: values.pageNumber })
              ).then(() => {
                dispatch(fetchBookInfo(bookId));
              });
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
          <div className={styles.iconContainer}>
            <h2 className={styles.progressTitle}>
              {currentView === "diary" ? "Diary" : "Statistics"}
            </h2>
            <div className={styles.icons}>
              <img
                className={`${styles.icon} ${
                  currentView === "diary" ? styles.active : ""
                }`}
                onClick={() => setCurrentView("diary")}
                src={
                  currentView === "diary" ? hourglassactive : hourglasspassive
                }
                alt="Diary"
              />
              <img
                className={`${styles.icon} ${
                  currentView === "other" ? styles.active : ""
                }`}
                onClick={() => setCurrentView("other")}
                src={currentView === "other" ? piechartactive : piechartpassive}
                alt="Other"
              />
            </div>
          </div>

          {currentView === "diary" ? (
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
          ) : (
            <div>
              <p className={styles.statisticsText}>
                Each page, each chapter is a new round of knowledge, a new step
                towards understanding. By rewriting statistics, we create our
                own reading history.
              </p>
              <div className={styles.statistics}>
                <div className={styles.chartContainer}>
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className={styles.centerText}>{percentage}%</div>
                </div>
                <div className={styles.progressInfo}>
                  <div className={styles.sign}></div>
                  <div className={styles.progressDetails}>
                    <p className={styles.percentageText}>{percentage}%</p>
                    <p className={styles.pagesReadText}>
                      {totalReadPages} pages read
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        variant="goodjob"
      />
    </div>
  );
};

export default MyReadingsFilter;
