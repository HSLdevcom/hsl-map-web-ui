import React from "react";
import classNames from "classnames";
import busIcon from "../icons/icon-bus-station.svg";
import tramIcon from "../icons/icon-tram.svg";
import styles from "./lineIcon.css";

const LineIcon = ({ transportType, shortName, lineNameFi, iconSize, additionalStyle }) =>
    (<div style={additionalStyle}>
        <span className={styles.lineIconWrapper}>
            {transportType === "tram" ?
                <img src={tramIcon} alt="" height={iconSize}/> :
                <img src={busIcon} alt="" height={iconSize}/>}
            <span
              className={classNames(styles.lineNumber,
                  { [styles.tram]: transportType === "tram",
                      [styles.bus]: transportType !== "tram" }
              )}
            >
                {shortName}
            </span>
            <p>{lineNameFi}</p>
        </span>
    </div>
);

export default LineIcon;
