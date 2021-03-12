import React from "react";
import { groupBy } from "lodash";
import classNames from "classnames";
import RouteFilterItem from "./routeFilterItem";
import ExpandButton from "./expandButton";
import styles from "./routeFilter.module.css";

const parseDate = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("fi-FI", options);
};

const RouteFilter = (props) => (
  <div
    id="route-filter"
    className={classNames(
      styles.root,
      { [styles.filterContainerFullScreen]: props.isFullScreen },
      {
        [styles.filterContainerHideFilter]: props.isFullScreen && !props.showFilter,
      }
    )}>
    {props.isFullScreen ? (
      <ExpandButton
        onClick={props.toggleFilter}
        labelText="Valitse reitit"
        isExpanded={props.showFilter}
      />
    ) : null}
    <div className={props.isFullScreen && !props.showFilter ? styles.hidden : ""}>
      {Object.values(groupBy(props.routes, "dateBegin")).map((routeDate, dateIndex) => (
        <div key={`routeFilterDateGroup${dateIndex}`}>
          <p className={styles.dateLabel}>
            {parseDate(routeDate[0].dateBegin)} - {parseDate(routeDate[0].dateEnd)}
          </p>
          <div className={styles.filterItemsWrapper}>
            {routeDate.map((route, routeIndex) => {
              const id = `${route.name}_${route.routeId}_${route.direction}_${route.dateBegin}_${route.dateEnd}`;
              return (
                <RouteFilterItem
                  key={`routeFilterItem_${dateIndex * routeDate.length + routeIndex}`}
                  id={id}
                  routeID={route.routeId}
                  routeDirection={route.direction}
                  routeDateBegin={route.dateBegin}
                  routeStops={route.routeSegments.nodes
                    .map((node) => ({
                      ...node.stop,
                      duration: node.duration,
                      stopIndex: node.stopIndex,
                    }))
                    .sort((a, b) => a.stopIndex - b.stopIndex)}
                  transportType={props.transportType}
                  isFullScreen={props.isFullScreen}
                  isChecked={props.selectedRoutes.includes(id)}
                  onChange={props.toggleChecked}
                  setMapCenter={props.setMapCenter}
                  color={route.color}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RouteFilter;
