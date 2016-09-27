import React from "react";
import { Link } from "react-router";
import styles from "./route.css";
import busIcon from "../icons/icon-bus-station.svg";

const Route = ({ routeId, longName, shortName }) =>
    (<div className={styles.icon}>
        <span >
            <img src={busIcon} alt="Bus" height="27"/>
            <Link
              to={{
                  pathname: routeId,
                  query: { routeName: longName, routeNumber: shortName },
              }}
            >
                <span className={styles.routeNumber}>{shortName}</span>
                <span>{longName}</span>
            </Link>
        </span>
    </div>);

Route.propTypes = {
    routeId: React.PropTypes.string.isRequired,
    longName: React.PropTypes.string,
    shortName: React.PropTypes.string,
};

export default Route;
