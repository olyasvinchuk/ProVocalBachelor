import React from "react";
import styles from "../styles/CoursesCatalogStyles.module.css";
import { ReactComponent as Logo } from "../assets/headerImages/PROVOCALIcon.svg";

import { Link } from "react-router-dom";

const CourseBlock = ({ title, blured, type, id }) => {
  return (
    <div className={styles.courseContainer}>
      {blured ? (
        <Link
          to={
            type === "1" ? `/courses/course/${id}` : `/courses/courseBelt/${id}`
          }
        >
          <div className={styles.courseImgCont}>
            <Logo style={{ color: "#0c1010", transform: "scale(1.03)" }} />
          </div>
        </Link>
      ) : (
        <div className={styles.courseImgCont}>
          <div className={styles.lock}>
            <img src="/lock.png" alt=""></img>
          </div>
          <div className={styles.neededModules}>
            <span>Для доступу до цього модуля</span>
            <ul>
              <li>Пройдіть модуль “Сила(дихальна система)”</li>
            </ul>
          </div>
          <Logo style={{ color: "#0c1010", filter: "blur(4px)" }} />
        </div>
      )}
      <div className={styles.courseTitle}>
        <span>{title}</span>
      </div>
    </div>
  );
};

export default CourseBlock;
