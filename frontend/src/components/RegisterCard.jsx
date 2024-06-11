import React, { useState, useContext } from "react";
import styles from "../styles/RegisterCardStyles.module.css";
import leftSideLogo from "../assets/authImages/logoLeftSide.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterCard = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const errFields = () => toast.warning("Заповніть всі поля!");
  const errPass = () => toast.warning("Паролі не співпадають!");
  const smtWentWrong = () => toast.error("Щось пішло не так");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password, repassword } = formData;

    if (!username || !password || !repassword) {
      errFields();
      return;
    }

    if (password !== repassword) {
      errPass();
      return;
    }

    fetch("http://localhost:1234/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/", { state: { loggedIn: true } });
          login(data.token);
        } else {
          smtWentWrong();
        }
      })
      .catch((error) => {
        smtWentWrong();
        console.error("Помилка:", error);
      });
  };

  return (
    <div className={styles.loginCardCont}>
      <ToastContainer />
      <div className={styles.loginCard}>
        <img src={leftSideLogo} alt="Left Side Logo" />
        <div className={styles.loginForm}>
          <h2>Реєстрація</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputsCont}>
              <div className={styles.usernameInputGroup}>
                <label htmlFor="username">Логін:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.usernameInputGroup}>
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.usernameInputGroup}>
                <label htmlFor="repassword">Повторіть пароль:</label>
                <input
                  type="password"
                  id="repassword"
                  name="repassword"
                  value={formData.repassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className={styles.logBtn}>Реєстрація</button>
          </form>
          <div className={styles.orElement}>
            <div className={styles.greyLine}></div>
            <span>або</span>
            <div className={styles.greyLine}></div>
          </div>
          <div className={styles.googleIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </div>
          <div className={styles.noAccTxt}>
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
