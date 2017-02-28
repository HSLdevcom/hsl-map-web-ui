import React from "react";
import { groupBy } from "lodash";
import classNames from "classnames";
import RouteFilterItem from "./routeFilterItem";
import ExpandButton from "./expandButton";
import styles from "./routeFilter.css";

const parseDate = (date) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString("fi-FI", options);
};

const RouteFilter = props => (
    <div
      id="route-filter"
      className={classNames(styles.root,
          { [styles.filterContainerFullScreen]: (props.isFullScreen) },
          { [styles.filterContainerHideFilter]: (props.isFullScreen && !props.showFilter) })}
      onMouseEnter={() => props.scrollWheelUpdate(false)}
      onMouseLeave={() => props.scrollWheelUpdate(true)}
    >
        {props.isFullScreen ?
            <ExpandButton
              onClick={props.toggleFilter}
              labelText="Valitse reitit"
              isExpanded={props.showFilter}
            />
            : null
        }
        <div className={(props.isFullScreen && !props.showFilter) ? styles.hidden : ""}>
            { Object.values(groupBy(props.routeStops, "dateBegin")).map((routeDate, dateIndex) => (
                <div key={`routeFilterDateGroup${dateIndex}`}>
                    <p className={styles.dateLabel}>
                        {parseDate(routeDate[0].dateBegin)} - {parseDate(routeDate[0].dateEnd)}
                    </p>
                    <div className={styles.filterItemsWrapper}>
                        {routeDate.map((route, routeIndex) => (
                            <RouteFilterItem
                              key={`routeFilterItem_${(dateIndex * routeDate.length) + routeIndex}`}
                              routeID={route.routeId}
                              routeDirection={route.direction}
                              routeDateBegin={route.dateBegin}
                              routeStops={route.stops}
                              transportType={props.transportType}
                              isFullScreen={props.isFullScreen}
                              isChecked={props.selectedRoutes.includes(
                                `${route.routeId}_${route.direction}_${route.dateBegin}`
                              )}
                              onChange={props.toggleChecked}
                            />
                          ))}
                    </div>
                </div>)
             )}
        </div>
    </div>
);

export default RouteFilter;
