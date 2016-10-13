import React from "react";
import styles from "./routeFilterItem.css";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const RouteFilterItem = (
  { routeID, routeDirection, routeDateBegin, isChecked, onChange }) =>
    (<div className={styles.root}>
        <span className={styles.filterName}>{parseRouteNumber(routeID)}</span>
        <span> suunta {routeDirection}</span>
        <label
          className={styles.switch}
          htmlFor={`filterCheckbox_${routeID}_${routeDirection}_${routeDateBegin}`}
        >
            <input
              id={`filterCheckbox_${routeID}_${routeDirection}_${routeDateBegin}`}
              type="checkbox"
              value={`${routeID}_${routeDirection}_${routeDateBegin}`}
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
