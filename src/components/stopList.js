import React from "react";
import Stop from "./stop";
import styles from "./stopList.css";

const renderStops = (routeStops, isFullScreen, setMapCenter) =>
    routeStops.map((stop, index) => (
        <Stop
          key={`stop${index}`}
          shortId={stop.shortId}
          stopNameFi={stop.nameFi}
          stopNameSv={stop.nameSe}
          duration={stop.duration}
          isFullScreen={isFullScreen}
          onClick={() => setMapCenter({ lat: stop.lat, lng: stop.lon, stopId: stop.stopId })}
        />
    ));

const StopList = ({ routeStops, isOpen, isFullScreen, setMapCenter }) => {
    if (!routeStops || !isOpen) return null;

    return (
        <div className={styles.root}>
            {renderStops(routeStops, isFullScreen, setMapCenter)}
        </div>
    );
};

export default StopList;
