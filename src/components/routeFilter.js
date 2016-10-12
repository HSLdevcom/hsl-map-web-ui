import React from "react";
import { groupBy } from "lodash";
import RouteFilterItem from "./routeFilterItem";
import styles from "./routeFilter.css";

const parseDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
};

const RouteFilter = ({ routeStops, handleChange, selectedRoutes }) => (
    <div className={styles.root}>
        <h3>Valitse reitit</h3>
        { Object.values(groupBy(routeStops, "dateBegin")).map((routeDate, dateIndex) => (
            <div>
                <p className={styles.dateLabel}>
                    {parseDate(routeDate[0].dateBegin)} - {parseDate(routeDate[0].dateEnd)}
                </p>
                {routeDate.map((route, routeIndex) => (
                    <RouteFilterItem
                      itemKey={(dateIndex * routeDate.length) + routeIndex}
                      routeID={route.routeId}
                      routeDirection={route.direction}
                      routeDateBegin={route.dateBegin}
                      isChecked={selectedRoutes.includes(
                        `${route.routeId}_${route.direction}_${route.dateBegin}`
                      )}
                      onChange={handleChange}
                    />
                ))}
            </div>)
        )}

    </div>
);

export default RouteFilter;
