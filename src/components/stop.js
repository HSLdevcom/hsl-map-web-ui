import React from "react";
import styles from "./stop.module.css";
import PropTypes from "prop-types";

const Stop = ({
  shortId,
  stopNameFi,
  stopNameSv,
  duration,
  isFullScreen,
  onClick
}) => (
  <button className={styles.root} onClick={onClick}>
    <p className={styles.textTitle}>{shortId}</p>
    <div className={isFullScreen ? styles.fullScreen : ""}>
      <p className={styles.textPrimary}>{stopNameFi}</p>
      <p className={styles.textAdditional}>{stopNameSv}</p>
      <p className={styles.textDuration}>{duration} min</p>
    </div>
  </button>
);

Stop.propTypes = {
  shortId: PropTypes.string.isRequired,
  stopNameFi: PropTypes.string,
  stopNameSv: PropTypes.string,
  duration: PropTypes.number
};

export default Stop;
