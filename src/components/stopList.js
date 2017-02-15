import React from "react";
import Stop from "./stop";
import styles from "./stopList.css";

const renderStops = routeStops =>
    routeStops.map(stop => (
        <Stop
          shortId={stop.shortId}
          stopNameFi={stop.name_fi}
          stopNameSv={stop.name_se}
          duration={stop.duration}
        />
    ));

const StopList = ({ routeStops, isOpen }) => {
    if (!routeStops || !isOpen) return null;

    return (
        <div className={styles.root}>
            {renderStops(routeStops)}
        </div>
    );
};

export default StopList;
