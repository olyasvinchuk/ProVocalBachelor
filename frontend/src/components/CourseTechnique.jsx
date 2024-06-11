import { React, useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { ReactComponent as MoveBack } from "../assets/secondaryIcons/moveBackIcon.svg";
import { ReactComponent as Waves } from "../assets/coursePageAssets/courseBottomWave.svg";
import styles from "../styles/CourseStyles.module.css";
import stylesBtn from "./../styles/MainButtonStyles.module.css";
import MainButton from "../atoms/buttons/MainButton";
import Header from "./Header";
import AudioPlayer from "./AudioPalyer/AudioPlayer";
import tracks from "./AudioPalyer/tracks";
import SkeletonModel from "../atoms/3dmodels/skeleton";
import { AuthContext } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseTechinque = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const { isUserAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const editSucces = () => toast.success("Зміни збережено");
  const smtWentWrong = () => toast.error("Щось пішло не так");

  const [updateData, setUpdateData] = useState({
    id: "",
    title: "",
    description: "",
    content: "",
    file: null,
  });

  const loadTrainings = async (id) => {
    try {
      const response = await fetch(`http://localhost:1234/api/trainings/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trainings");
      }
      const data = await response.json();
      setCourse(data.data);
    } catch (error) {
      console.error("Error loading trainings:", error.message);
    }
  };

  useEffect(() => {
    console.log("Course ID:", id);

    if (id) {
      loadTrainings(id);
    } else {
      console.log("ID is undefined");
    }
  }, [id]);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpdate = (training) => {
    setUpdateData({
      id: training._id,
      title: training.title,
      category: training.category,
      content: training.content,
      description: training.description,
      file: null,
    });
  };

  const updateTraining = async (e) => {
    e.preventDefault();
    let base64File = null;

    if (updateData.file) {
      base64File = await toBase64(updateData.file);
    }

    const data = {
      title: updateData.title,
      description: updateData.description,
      category: updateData.category,
      content: updateData.content,
      file: base64File,
    };

    try {
      const response = await fetch(
        `http://localhost:1234/api/trainings/${updateData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw smtWentWrong();
      }

      setUpdateData({
        id: "",
        category: "",
        content: "",
        title: "",
        description: "",
        file: null,
      });
      loadTrainings();
      editSucces();
      window.location.reload();
    } catch (error) {
      smtWentWrong();
    }
  };
  const deleteTraining = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/trainings/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw smtWentWrong();
      }
      navigate("/courses", { state: { courseDeleted: true } });
      loadTrainings();
    } catch (error) {
      smtWentWrong();
    }
  };

  const closeModal = () => {
    setUpdateData(false);
  };
  const completeCourse = () => {
    navigate("/courses", { state: { courseCompleted: true } });
  };
  return (
    <div className={styles.mainCont}>
      <ToastContainer />
      <Header theme="dark" />

      {updateData.id && (
        <div className={styles.updateFormCont}>
          <form onSubmit={updateTraining}>
            <label for="name">Назва</label>
            <input
              type="text"
              id="name"
              placeholder="New Title"
              value={updateData.title}
              onChange={(e) =>
                setUpdateData({ ...updateData, title: e.target.value })
              }
            />
            <label for="descr">Контент курсу</label>
            <textarea
              id="descr"
              placeholder="New Description"
              value={updateData.description}
              onChange={(e) =>
                setUpdateData({ ...updateData, description: e.target.value })
              }
            />
            <label for="rules">Правила </label>
            <textarea
              id="rules"
              type="text"
              placeholder="Content"
              value={updateData.content}
              onChange={(e) =>
                setUpdateData({ ...updateData, content: e.target.value })
              }
            />
            <label for="visuals">Візуалізації </label>

            <input
              id="visuals"
              type="file"
              onChange={(e) =>
                setUpdateData({ ...updateData, file: e.target.files[0] })
              }
            />
            <button className={stylesBtn.smallBtn} type="submit">
              Оновити
            </button>
            <button className={styles.cancelbtn} onClick={closeModal}>
              Скасувати
            </button>
          </form>
        </div>
      )}
      <div className={styles.courseContainer}>
        <div className={styles.moveIconCont}>
          <Link to="/courses">
            <MoveBack />
          </Link>
          {isUserAdmin && (
            <div>
              <button
                style={{
                  marginLeft: "20px",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={() => handleUpdate(course)}
              >
                <MainButton text="Редагувати" />
              </button>
              <button
                style={{
                  marginLeft: "20px",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={() => deleteTraining(course._id)}
              >
                <MainButton text="Видалити" />
              </button>
            </div>
          )}
        </div>
        <div className={styles.courseMaterialsCont}>
          <div className={styles.additionalCont}>
            <div className={styles.courseTextMaterials}>
              <h2>{course.title}</h2>
              <span
                dangerouslySetInnerHTML={{ __html: course.description }}
              ></span>
              <span className={styles.fatText2}>
                <ul
                  className={styles.twoColumnList}
                  dangerouslySetInnerHTML={{ __html: course.content }}
                ></ul>
              </span>
            </div>
            <AudioPlayer tracks={tracks} />
          </div>
          <div className={styles.courseImgMaterials} style={{ width: "50%" }}>
            <SkeletonModel
              modelUrl="/3DModels/66674249eb4a1fb33e44a332.octet-stream"
              position={[0, -0.5, 0]}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              zIndex: "99",
            }}
            onClick={completeCourse}
          >
            <MainButton text="Готово!" linkTo="/courses" type="big" />
          </button>
        </div>
      </div>

      <Waves className={styles.wave} />
    </div>
  );
};

export default CourseTechinque;
