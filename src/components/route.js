import React from "react";
import styles from "./route.css";
import busIcon from "../icons/icon-bus-station.svg";

const Route = ({ routeId, longName, shortName }) =>
    (<div className={styles.icon}>
        <span >
            <img src={busIcon} alt="Bus" height="27"/>
            <a href={routeId}>
                <span className={styles.routeNumber}>{shortName}</span>
                <span>{longName}</span></a>
        </span>
    </div>);

Route.propTypes = {
    routeId: React.PropTypes.string.isRequired,
    longName: React.PropTypes.string,
    shortName: React.PropTypes.string,
};

export default Route;
