import React from "react";
import styles from "../../styles/MainButtonStyles.module.css";
import { Link } from "react-router-dom";

const MainButton = ({ text, linkTo, type }) => {
  return (
    <Link to={linkTo} style={{ zIndex: 99 }}>
      <button className={type === "big" ? styles.bigBtn : styles.smallBtn}>
        {text}
      </button>
    </Link>
  );
};

export default MainButton;
