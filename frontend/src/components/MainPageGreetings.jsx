import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/MainPageStyles.module.css";
import Header from "./Header";
import mascot from "../assets/mainPageAssets/mascotImg.png";
import MainButton from "../atoms/buttons/MainButton";
import waves from "../assets/mainPageAssets/topLeftWaves.png";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArrowIcon = () => (
  <svg
    className={styles.arrowIcon}
    width="50"
    height="40"
    viewBox="0 0 303 333"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="arrow">
      <path
        id="arrow-icon-one"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M217.788 30.1911L238.52 1.11013C239.575 -0.369942 241.267 -0.370058 242.322 1.10987L356.313 160.978C358.45 163.975 358.481 168.878 356.381 171.928C356.359 171.961 356.336 171.993 356.313 172.025L242.321 331.922C241.266 333.402 239.575 333.402 238.52 331.922L217.789 302.854C216.72 301.356 216.705 298.905 217.755 297.379C217.766 297.362 217.778 297.346 217.789 297.33L309.132 169.278C310.201 167.78 310.217 165.329 309.167 163.803C309.156 163.786 309.144 163.77 309.132 163.753L217.789 35.7153C216.72 34.2171 216.705 31.7658 217.754 30.2401C217.765 30.2236 217.777 30.2073 217.788 30.1911Z"
        fill="white"
      />
      <path
        id="arrow-icon-two"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M109.3 30.1911L130.032 1.11013C131.087 -0.369942 132.778 -0.370058 133.833 1.10987L247.825 160.978C249.962 163.975 249.992 168.878 247.893 171.928C247.87 171.961 247.848 171.993 247.825 172.025L133.833 331.922C132.778 333.402 131.087 333.402 130.031 331.922L109.3 302.854C108.232 301.356 108.216 298.905 109.266 297.379C109.278 297.362 109.289 297.346 109.301 297.33L200.644 169.278C201.713 167.78 201.728 165.329 200.679 163.803C200.667 163.786 200.655 163.77 200.644 163.753L109.3 35.7153C108.232 34.2171 108.216 31.7658 109.266 30.2401C109.277 30.2236 109.288 30.2073 109.3 30.1911Z"
        fill="white"
      />
      <path
        id="arrow-icon-three"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.811259 30.1911L21.543 1.11013C22.5981 -0.369942 24.2895 -0.370058 25.3447 1.10987L139.336 160.978C141.473 163.975 141.504 168.878 139.404 171.928C139.382 171.961 139.359 171.993 139.336 172.025L25.3443 331.922C24.2893 333.402 22.5981 333.402 21.5428 331.922L0.811938 302.854C-0.256692 301.356 -0.272075 298.905 0.77758 297.379C0.788997 297.362 0.800518 297.346 0.812143 297.33L92.1553 169.278C93.224 167.78 93.2396 165.329 92.19 163.803C92.1785 163.786 92.1669 163.77 92.1552 163.753L0.81195 35.7153C-0.256846 34.2171 -0.272498 31.7658 0.776989 30.2401C0.78831 30.2236 0.799734 30.2073 0.811259 30.1911Z"
        fill="white"
      />
    </g>
  </svg>
);
const MainPageGreetings = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.loggedOut) {
      toast.success("Ви вийшли з акаунту!");
    }
    if (location.state && location.state.loggedIn) {
      toast.success("Ласкаво просимо!");
    }
  }, [location.state]);
  return (
    <div>
      <ToastContainer />
      <img src={waves} alt="" className={styles.topLeftWaves}></img>
      <Header theme="dark" />
      <div className={styles.upperMainBlock}>
        <div className={styles.greetTextCont}>
          <div className={styles.textCont}>
            <div className={styles.mainTextCont}>
              <span className={styles.mainText}>
                КУРС ДЛЯ ВОКАЛІСТІВ ЗА МЕТОДИКОЮ ESTILL VOICE
              </span>
            </div>
            <div className={styles.secondaryTextCont}>
              <span className={styles.secondaryText}>
                Хочеш навчатись прямо зараз?
              </span>
              {isAuthenticated ? (
                <MainButton text="Розпочати" linkTo="/courses" type="big" />
              ) : (
                <MainButton text="Розпочати" linkTo="/login" type="big" />
              )}
            </div>
          </div>
          <div className={styles.greetImgCont}>
            <img src={mascot} alt="" />
            <div className={styles.shadow}></div>
          </div>
        </div>
      </div>
      <div className={styles.swipeBlockCont}>
        <span>гортайте, щоб дізнатись більше</span>
        <div className={styles.btnConteiner}>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
};

export default MainPageGreetings;
