import React from "react";
import styles from "./stop.module.css";
import PropTypes from "prop-types";
import timeIcon2 from "../icons/icon-time2.svg";

const Stop = ({
  shortId,
  stopNameFi,
  stopNameSv,
  duration,
  platform,
  onClick,
  timingStopType,
}) => (
  <button className={styles.root} onClick={onClick}>
    <p className={styles.textTitle}>{shortId}</p>
    <div className={styles.infoContainer}>
      <div className={styles.infoContentContainer}>
        <div className={styles.textPrimary}>{stopNameFi}</div>
        {platform && <div className={styles.platformNumber}>{platform}</div>}
      </div>
      <div className={styles.additionalInfoContainer}>
        <div className={styles.textAdditional}>{stopNameSv}</div>
        <div className={styles.textDuration}>{duration} min</div>
      </div>
    </div>
    {timingStopType > 0 && (
      <img className={styles.timingStopIcon} alt="timing stop" src={timeIcon2} />
    )}
  </button>
);

Stop.propTypes = {
  shortId: PropTypes.string.isRequired,
  stopNameFi: PropTypes.string,
  stopNameSv: PropTypes.string,
  duration: PropTypes.number,
};

export default Stop;
