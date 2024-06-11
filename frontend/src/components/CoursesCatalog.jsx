import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import styles from "../styles/CoursesCatalogStyles.module.css";
import { ReactComponent as Waves } from "../assets/coursePageAssets/coursePageWaves.svg";
import CourseBlock from "./CourseBlock";
import MainButton from "../atoms/buttons/MainButton";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CoursesCatalog() {
  const location = useLocation();

  const courseCreated = () => toast.success("Курс створено!");
  const errorCourse = () => toast.error("Заповніть всі поля!");
  const courseCompleted = () => toast.success("Вітаємо з проходженням курсу!");

  const { isUserAdmin } = useContext(AuthContext);

  const [progress, setProgress] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    content: "",
    file: null,
  });

  useEffect(() => {
    loadTrainings();
    loadCategories();
    if (location.state && location.state.courseDeleted) {
      toast.success("Курс видалено!");
    }
    if (location.state && location.state.courseCompleted) {
      courseCompleted();
      setCompleted(true);
    }
  }, [location.state]);

  const loadTrainings = async () => {
    try {
      const response = await fetch("http://localhost:1234/api/trainings");
      if (!response.ok) {
        throw new Error("Failed to fetch trainings");
      }
      const data = await response.json();
      setTrainings(data.data);
    } catch (error) {
      console.error("Error loading trainings:", error.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:1234/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error loading categories:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let base64File = null;

    if (formData.file) {
      base64File = await toBase64(formData.file);
    }

    const data = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      description: formData.description,
      file: base64File,
    };

    try {
      const response = await fetch("http://localhost:1234/api/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add training");
      }

      setFormData({
        title: "",
        category: "",
        content: "",
        description: "",
        file: null,
      });
      setShowModal(false);
      courseCreated();
      loadTrainings();
    } catch (error) {
      console.error("Error adding training:", error.message);
      errorCourse();
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const typeOneCourse = trainings.filter(
    (course) => course.category.name === "1"
  );
  const typeTwoCourse = trainings.filter(
    (course) => course.category.name === "2"
  );

  return (
    <div className={styles.mainContainer}>
      <ToastContainer />
      {showModal && (
        <div className={styles.darkBG}>
          <div className={styles.centered}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>Створити курс</h5>
              </div>

              <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.usernameInputGroup}>
                    <input
                      type="text"
                      placeholder="Назва курсу"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Виберіть категорію курсу</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Контент"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <textarea
                      placeholder="Правила"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content: e.target.value,
                        })
                      }
                    />
                    {/* <input
                      type="file"
                      onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files[0] })
                      }
                    /> */}
                    <div className={styles.modalBtnCont}>
                      <button className={styles.deleteBtn} type="submit">
                        Створити курс
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={toggleModal}
                        type="button"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Header theme="dark" />
      <Waves className={styles.wave} />

      <div className={styles.catalogContainer}>
        <div className={styles.progressContainer}>
          <div className={styles.progressTitle}>
            <span className={styles.titleTxt}>Прогрес курсу</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <progress
            className={styles.progressBar}
            value={progress}
            max={100}
          ></progress>
        </div>
        <div className={styles.introductionContainer}>
          <div className={styles.blocksTitle}>
            <span>Введення в Estill Voice</span>
            {isUserAdmin && (
              <div className={styles.addCourseBtnCont}>
                <button className={styles.butOnBut} onClick={toggleModal}>
                  <MainButton text="Додати курс" type="small" />
                </button>
              </div>
            )}
          </div>
          <div className={styles.listCourses}>
            {typeOneCourse.map((course) => (
              <div key={course._id}>
                <CourseBlock
                  id={course._id}
                  title={course.title}
                  blured={true}
                  type={course.category.name}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.opportunitiesContainer}>
          <div className={styles.blocksTitle}>
            <span>Можливості</span>
          </div>
          <div className={styles.listCourses}>
            {typeTwoCourse.map((course) => (
              <div key={course._id}>
                <CourseBlock
                  id={course._id}
                  title={course.title}
                  blured={true}
                  type={course.category.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesCatalog;
