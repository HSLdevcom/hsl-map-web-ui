import React from "react";
import styles from "./stop.module.css";
import PropTypes from "prop-types";
import timeIcon2 from "../icons/icon-time2.svg";

const Stop = ({
  shortId,
  stopNameFi,
  stopNameSv,
  duration,
  isFullScreen,
  onClick,
  timingStopType,
}) => (
  <button className={styles.root} onClick={onClick}>
    <p className={styles.textTitle}>{shortId}</p>
    <div className={isFullScreen ? styles.fullScreen : ""}>
      <p className={styles.textPrimary}>{stopNameFi}</p>
      <p className={styles.textAdditional}>{stopNameSv}</p>
      <p className={styles.textDuration}>{duration} min</p>
      {timingStopType === 2 && <img src={timeIcon2} />}
    </div>
  </button>
);

Stop.propTypes = {
  shortId: PropTypes.string.isRequired,
  stopNameFi: PropTypes.string,
  stopNameSv: PropTypes.string,
  duration: PropTypes.number,
};

export default Stop;
