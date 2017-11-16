import React from "react";
import styles from "./stop.css";

const Stop = ({ shortId, stopNameFi, stopNameSv, duration, isFullScreen, onClick }) =>
    (<button className={styles.root} onClick={onClick}>
        <p className={styles.textTitle}>{shortId}</p>
        <div className={isFullScreen ? styles.fullScreen : ""}>
            <p className={styles.textPrimary}>{stopNameFi}</p>
            <p className={styles.textAdditional}>{stopNameSv}</p>
            <p className={styles.textDuration}>{duration} min</p>
        </div>
    </button>);

Stop.propTypes = {
    shortId: React.PropTypes.string.isRequired,
    stopNameFi: React.PropTypes.string,
    stopNameSv: React.PropTypes.string,
    duration: React.PropTypes.number,
};

export default Stop;
