import React from "react";
import styles from "./routeFilterItem.css";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const RouteFilterItem = ({ routeID, routeDirection, isChecked, onChange }) =>
    (<div className={styles.root}>
        <span className={styles.filterName}>{parseRouteNumber(routeID)}</span>
        <span> {routeDirection === "2" ? "Paluu" : "Meno"}</span>
        <label
          className={styles.switch}
          htmlFor={routeID + "_" + routeDirection}
        >
            <input
              id={routeID + "_" + routeDirection}
              type="checkbox"
              value={routeID + "_" + routeDirection}
              checked={isChecked}
              onChange={onChange}
            />
            <div className={styles.slider}/>
        </label>
    </div>);

RouteFilterItem.propTypes = {
    routeID: React.PropTypes.string,
};

export default RouteFilterItem;
