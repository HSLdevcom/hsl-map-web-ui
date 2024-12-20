import React from "react";
import Stop from "./stop";
import styles from "./stopList.module.css";

const renderStops = (routeStops, isFullScreen, setMapCenter) =>
  routeStops.map((stop, index) => (
    <Stop
      key={`stop${index}`}
      shortId={stop.shortId}
      stopNameFi={stop.nameFi}
      stopNameSv={stop.nameSe}
      timingStopType={stop.timingStopType}
      platform={stop.platform}
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
