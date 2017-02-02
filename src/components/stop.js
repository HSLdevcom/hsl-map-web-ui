import React from "react";
import styles from "./stop.css";

const Stop = ({ shortId, stopNameFi, stopNameSv, duration }) =>
    (<div className={styles.root}>
        <p className={styles.textTitle}>{shortId}</p>
        <div>
            <p className={styles.textPrimary}>{stopNameFi}</p>
            <p className={styles.textAdditional}>{stopNameSv}</p>
            <p className={styles.textDuration}>{duration} min</p>
        </div>
    </div>);

Stop.propTypes = {
    shortId: React.PropTypes.string.isRequired,
    stopNameFi: React.PropTypes.string,
    stopNameSv: React.PropTypes.string,
    duration: React.PropTypes.number,
};

export default Stop;
