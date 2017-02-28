import React from "react";
import Stop from "./stop";
import styles from "./stopList.css";

const renderStops = (routeStops, isFullScreen) =>
    routeStops.map((stop, index) => (
        <Stop
          key={`stop${index}`}
          shortId={stop.shortId}
          stopNameFi={stop.name_fi}
          stopNameSv={stop.name_se}
          duration={stop.duration}
          isFullScreen={isFullScreen}
        />
    ));

const StopList = ({ routeStops, isOpen, isFullScreen }) => {
    if (!routeStops || !isOpen) return null;

    return (
        <div className={styles.root}>
            {renderStops(routeStops, isFullScreen)}
        </div>
    );
};

export default StopList;
