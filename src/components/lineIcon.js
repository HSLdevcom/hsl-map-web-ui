import React from "react";
import classNames from "classnames";
import busIcon from "../icons/icon-bus-station.svg";
import tramIcon from "../icons/icon-tram.svg";
import styles from "./lineIcon.css";

const LineIcon = ({ transportType, shortName, iconSize, additionalStyle }) =>
    (<span className={styles.root}>
        {transportType === "tram" ?
            <img src={tramIcon} alt="" height={iconSize}/> :
            <img src={busIcon} alt="" height={iconSize}/>}
        <span
          style={additionalStyle}
          className={classNames(styles.lineNumber,
            { [styles.tram]: transportType === "tram",
            [styles.bus]: transportType !== "tram" }
          )}
        >
            {shortName}
        </span>
    </span>);

export default LineIcon;
