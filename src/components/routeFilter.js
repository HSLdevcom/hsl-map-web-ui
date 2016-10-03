import React from "react";
import RouteFilterItem from "./routeFilterItem";

const RouteFilter = ({ routeStops, handleChange, selectedRoutes }) => {
    const getRoutes = () => {
        if (routeStops) {
            return routeStops.map(route => (
                <RouteFilterItem
                  routeID={route.routeId}
                  routeDirection={route.direction}
                  isChecked={selectedRoutes.includes(route.routeId + "_" + route.direction)}
                  onChange={handleChange}
                />
            ));
        }
        return null;
    };

    return (<div>
      ROUTEFILTER
        {getRoutes()}
    </div>);
};

export default RouteFilter;
