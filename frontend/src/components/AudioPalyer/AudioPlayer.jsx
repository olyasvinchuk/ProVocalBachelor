import React, { useState, useRef, useEffect } from "react";
import AudioControls from "./AudioControls";
import styles from "./style.module.css";

const AudioPlayer = ({ tracks }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const audioRef = useRef(new Audio(tracks[0].audioSrc));

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const { duration } = audioRef.current;
  const intervalRef = useRef();

  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTrackProgress(audioRef.current.currentTime);
    }, [1000]);
  };
  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const { title, artist } = tracks[0];

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.titleCont}>
        <h2 className={styles.title}>{title}</h2>
        <h3 className={styles.artist}>{artist}</h3>
      </div>
      <div className={styles.track}>
        <AudioControls isPlaying={isPlaying} onPlayPauseClick={togglePlay} />
        <input
          type="range"
          value={trackProgress}
          min="0"
          max={duration ? duration : `${duration}`}
          className={styles.trackProg}
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
