import React from "react";
import Header from "../../components/Header/Header";
import MyLibraryFilter from "../../components/MyLibraryFilter/MyLibraryFilter";
import MyLibraryBooks from "../../components/MyLibraryBooks/MyLibraryBooks";

const Library = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <MyLibraryFilter />
        <MyLibraryBooks />
      </div>
    </div>
  );
};

export default Library;
