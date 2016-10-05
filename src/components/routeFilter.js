import React from "react";
import RouteFilterItem from "./routeFilterItem";
import styles from "./routeFilter.css";

const RouteFilter = ({ routeStops, handleChange, selectedRoutes }) => (
    <div className={styles.root}>
        <h3>Valitse reitit</h3>
        <div>
            {routeStops && routeStops.map(route => (
                <RouteFilterItem
                  routeID={route.routeId}
                  routeDirection={route.direction}
                  isChecked={selectedRoutes.includes(route.routeId + "_" + route.direction)}
                  onChange={handleChange}
                />
        ))}
        </div>
    </div>
);

export default RouteFilter;
