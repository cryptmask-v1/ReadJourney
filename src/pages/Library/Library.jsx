import React from "react";
import Header from "../../components/Header/Header";
import MyLibraryFilter from "../../components/MyLibraryFilter/MyLibraryFilter";
import MyLibraryBooks from "../../components/MyLibraryBooks/MyLibraryBooks";
import styles from "./Library.module.css";

const Library = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.libraryContent}>
        <MyLibraryFilter />
        <MyLibraryBooks />
      </div>
    </div>
  );
};

export default Library;
