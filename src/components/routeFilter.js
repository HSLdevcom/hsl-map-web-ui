import React from "react";
import { groupBy } from "lodash";
import classNames from "classnames";
import LineIcon from "./lineIcon";
import RouteFilterItem from "./routeFilterItem";
import ExpandButton from "./expandButton";
import styles from "./routeFilter.module.css";

const parseDate = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("fi-FI", options);
};

const RouteFilter = (props) => (
  <div
    // LineId is used when changing fullscreen mode and moving routes in and out the sidebar.
    id={"route-filter_" + props.lineId}
    className={classNames(
      "route-filter",
      styles.root,
      { [styles.filterContainerFullScreen]: props.isFullScreen },
      {
        [styles.filterContainerHideFilter]: props.isFullScreen && !props.showFilter,
      }
    )}>
    {props.isFullScreen && props.routeIndex === 0 ? (
      <ExpandButton
        onClick={props.toggleFilter}
        labelText="Valitse reitit"
        isExpanded={props.showFilter}
      />
    ) : null}
    <div className={props.isFullScreen && !props.showFilter ? styles.hidden : ""}>
      {Object.values(groupBy(props.routes, "dateBegin")).map((routeDate, dateIndex) => {
        const hasSelectedRoutes = routeDate.find((route) => {
          return props.selectedRoutes.includes(route.id);
        });
        return (
          <div
            key={`routeFilterDateGroup${dateIndex}`}
            className={classNames(hasSelectedRoutes === undefined ? styles.noPrint : "")}>
            <LineIcon
              transportType={routeDate[0].mode.toLowerCase()}
              shortName={routeDate[0].line.nodes[0].lineIdParsed}
              lineNameFi={routeDate[0].nameFi}
              iconSize="24"
              additionalStyle={{ marginBottom: "15px" }}
            />
            <p className={styles.dateLabel}>
              {parseDate(routeDate[0].dateBegin)} - {parseDate(routeDate[0].dateEnd)}
            </p>
            <div className={styles.filterItemsWrapper}>
              {routeDate.map((route, routeIndex) => {
                return (
                  <RouteFilterItem
                    key={`routeFilterItem_${dateIndex * routeDate.length + routeIndex}`}
                    id={route.id}
                    routeID={route.routeId}
                    routeDirection={route.direction}
                    routeDateBegin={route.dateBegin}
                    routeStops={route.routeSegments.nodes
                      .map((node) => ({
                        ...node.stop,
                        duration: node.duration,
                        stopIndex: node.stopIndex,
                        timingStopType: node.timingStopType,
                      }))
                      .sort((a, b) => a.stopIndex - b.stopIndex)}
                    transportType={props.transportType}
                    isFullScreen={props.isFullScreen}
                    isChecked={props.selectedRoutes.includes(route.id)}
                    onChange={props.toggleChecked}
                    setMapCenter={props.setMapCenter}
                    color={route.color}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default RouteFilter;
