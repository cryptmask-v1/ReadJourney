import React from "react";
import Header from "../../components/Header/Header.jsx";
import RecommendedBooks from "../../components/RecommendedBooks/RecommendedBooks.jsx";
import styles from "./Recommended.module.css";
import Filter from "../../components/Filter/Filter.jsx";

const Recommended = () => {
  return (
    <div className={styles.container}>
      <Header className={styles.header} />
      <div className={styles.recommendationContainer}>
        <Filter />
        <RecommendedBooks />
      </div>
    </div>
  );
};

export default Recommended;
