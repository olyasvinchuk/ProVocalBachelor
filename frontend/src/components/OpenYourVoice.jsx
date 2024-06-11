import React from "react";
import styles from "../styles/OpenVoiceStyles.module.css";
import whiteDude from "../assets/mainPageAssets/whiteDude.png";
import { ReactComponent as Waves } from "../assets/waves/middleWave.svg";
const OpenVoice = () => {
  return (
    <div className={styles.openYourVoiceCont}>
      <span className={styles.openVoiceTitle}>
        Відкрийте для себе свій голос по-новому!
      </span>
      <div className={styles.openVoiceContent}>
        <div className={styles.openVoiceLeft}>
          <img className={styles.whiteDudeImg} src={whiteDude} alt=""></img>
        </div>
        <div className={styles.openVoiceRight}></div>
      </div>
      <Waves className={styles.vave} />
    </div>
  );
};

export default OpenVoice;
