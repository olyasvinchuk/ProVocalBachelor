import React from "react";
import styles from "./style.module.css";
const AudioControls = ({ isPlaying, onPlayPauseClick }) => (
  <div className={styles.buttonCont}>
    {isPlaying ? (
      <button
        type="button"
        className={styles.pause}
        onClick={() => onPlayPauseClick(false)}
      ></button>
    ) : (
      <button
        type="button"
        className={styles.play}
        onClick={() => onPlayPauseClick(true)}
      ></button>
    )}
  </div>
);

export default AudioControls;
