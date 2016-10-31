import React from "react";
import { groupBy } from "lodash";
import RouteFilterItem from "./routeFilterItem";
import styles from "./routeFilter.css";

const parseDate = (date) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString("fi-FI", options);
};

const RouteFilter = ({ routeGeometries, handleChange, selectedRoutes }) => (
    <div className={styles.root}>
        { Object.values(groupBy(routeGeometries, "properties.beginDate")).map((routeDate, dateIndex) => (
            <div key={`routeFilterDateGroup${dateIndex}`}>
                <p className={styles.dateLabel}>
                    {parseDate(routeDate[0].properties.beginDate)}&nbsp;-&nbsp;
                    {parseDate(routeDate[0].properties.endDate)}
                </p>
                {routeDate.map((route, routeIndex) => (
                    <RouteFilterItem
                      key={`routeFilterItem_${(dateIndex * routeDate.length) + routeIndex}`}
                      routeID={route.properties.lineId}
                      routeDirection={route.properties.direction}
                      routeDateBegin={route.properties.beginDate}
                      isChecked={selectedRoutes.includes(
                        `${route.properties.lineId}_${route.properties.direction}_${route.properties.beginDate}`
                      )}
                      onChange={handleChange}
                    />
                ))}
            </div>)
        )}

    </div>
);

export default RouteFilter;
