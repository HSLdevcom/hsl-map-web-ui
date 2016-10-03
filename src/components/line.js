import React from "react";
import { Link } from "react-router";
import styles from "./line.css";
import busIcon from "../icons/icon-bus-station.svg";

const Line = ({ lineId, longName, shortName }) =>
    (<div>
        <span >
            <img src={busIcon} alt="Bus" height="27"/>
            <Link to={{ pathname: lineId }}>
                <span className={styles.lineNumber}>{shortName}</span>
                <span>{longName}</span>
            </Link>
        </span>
    </div>);

Line.propTypes = {
    lineId: React.PropTypes.string.isRequired,
    longName: React.PropTypes.string,
    shortName: React.PropTypes.string,
};

export default Line;
