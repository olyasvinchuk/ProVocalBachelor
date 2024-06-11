import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/headerImages/PROVOCALIcon.svg";
import accountIconWht from "../assets/headerImages/accountIcon.svg";
import accountIconBlk from "../assets/headerImages/accountIconBlack.svg";
import MainButton from "../atoms/buttons/MainButton";
import styles from "../styles/HeaderStyles.module.css";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = ({ theme }) => {
  const accountIconSrc = theme === "dark" ? accountIconWht : accountIconBlk;
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logOut = () => {
    logout();
    navigate("/", { state: { loggedOut: true } });
  };
  return (
    <div className={styles.header}>
      <div
        className={
          theme === "dark" ? styles.logoDarkCont : styles.logoLightCont
        }
      >
        <Link to="/">
          <Logo
            className={theme === "dark" ? styles.logoDark : styles.logoLight}
          />
        </Link>
        {isAuthenticated ? (
          <div
            style={{
              width: "185px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              <span>Головна</span>
            </Link>

            <Link
              to="/courses"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <span>Курс</span>
            </Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {isAuthenticated ? (
        <div
          className={
            theme === "light" ? styles.iconsLightCont : styles.iconsCont
          }
        >
          <img src={accountIconSrc} alt="" className={styles.accIcon} />
          <button onClick={logOut} className={styles.logoutBtn}>
            <img src="/logout.png" alt=""></img>
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login" className={styles.loginText}>
            <span>Увійти</span>
          </Link>
          <MainButton text="Реєстрація" linkTo="/register" type="small" />
        </div>
      )}
    </div>
  );
};

export default Header;
