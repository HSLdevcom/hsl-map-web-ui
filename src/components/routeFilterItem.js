import React from "react";
import classNames from "classnames";
import styles from "./routeFilterItem.css";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const RouteFilterItem = ({ routeID, routeDirection, isChecked, onChange }) =>
    (<div>
        <button
          className={classNames(styles.filterButton, { [styles.selected]: isChecked })}
          value={routeID + "_" + routeDirection}
          onClick={onChange}
        >
            <span> {parseRouteNumber(routeID)} </span>
            <span> {routeDirection === "2" ? "PALUU" : "MENO"} </span>
        </button>
    </div>);

RouteFilterItem.propTypes = {
    routeID: React.PropTypes.string,
};

export default RouteFilterItem;
