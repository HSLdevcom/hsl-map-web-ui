import React from "react";
import RouteFilterItem from "./routeFilterItem";
import styles from "./routeFilter.css";

const RouteFilter = ({ routeStops, handleChange, selectedRoutes }) => (
    <div className={styles.root}>
        <h3>Valitse reitit</h3>
        <div>
            {routeStops && routeStops.map((route, index) => (
                <RouteFilterItem
                  itemKey={index}
                  routeID={route.routeId}
                  routeDirection={route.direction}
                  routeDateBegin={route.dateBegin}
                  routeDateEnd={route.dateEnd}
                  isChecked={selectedRoutes.includes(route.routeId + "_" + route.direction + "_" + route.dateBegin)}
                  onChange={handleChange}
                />
        ))}
        </div>
    </div>
);

export default RouteFilter;
