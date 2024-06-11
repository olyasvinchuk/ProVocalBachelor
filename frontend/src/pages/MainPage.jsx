import React from "react";

import MainPageGreetings from "../components/MainPageGreetings";
import ProCourse from "../components/ProCourseComponent";
import OpenVoice from "../components/OpenYourVoice";
import UGonLearnOrbit from "../components/UGonLearnOrbit";

import styles from "../styles/MainContStyles.module.css";

function MainPage() {
  return (
    <div className={styles.mainPageCont}>
      <div className={styles.mainPageCompsHolder}>
        <MainPageGreetings />
        <ProCourse id="pro-course" />
        <OpenVoice />
        <UGonLearnOrbit />
      </div>
    </div>
  );
}

export default MainPage;
