import React from "react";
import styles from "./routeFilterItem.css";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const RouteFilterItem = (
  { itemKey, routeID, routeDirection, routeDateBegin, routeDateEnd, isChecked, onChange }) =>
    (<div className={styles.root}>
        <span className={styles.filterName}>{parseRouteNumber(routeID)}</span>
        <span> suunta {routeDirection}</span>
        <p className={styles.dateText}>
            {routeDateBegin.substring(0, 10)} - {routeDateEnd.substring(0, 10)}
        </p>
        <label
          className={styles.switch}
          htmlFor={"filterCheckbox" + routeID + "_" + itemKey}
        >
            <input
              id={"filterCheckbox" + routeID + "_" + itemKey}
              type="checkbox"
              value={routeID + "_" + routeDirection + "_" + routeDateBegin}
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
