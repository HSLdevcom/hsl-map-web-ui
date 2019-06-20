import React from "react";
import classNames from "classnames";
import BusIcon from "../icons/icon-bus-station.js";
import TramIcon from "../icons/icon-tram.js";
import styles from "./lineIcon.module.css";

const LineIcon = ({
  transportType,
  shortName,
  lineNameFi,
  iconSize,
  additionalStyle
}) => (
  <div style={additionalStyle}>
    <span className={styles.lineIconWrapper}>
      {transportType === "tram" ? (
        <TramIcon height={iconSize} />
      ) : (
        <BusIcon height={iconSize} />
      )}
      <span
        className={classNames(styles.lineNumber, {
          [styles.tram]: transportType === "tram",
          [styles.bus]: transportType !== "tram"
        })}
      >
        {shortName}
      </span>
      <p>{lineNameFi}</p>
    </span>
  </div>
);

export default LineIcon;
