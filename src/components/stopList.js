import React from "react";
import Stop from "./stop";
import styles from "./stopList.css";

const StopList = ({ routeStops, isOpen }) => {
    const renderStops = function () {
        return routeStops ? routeStops.map(stop => (
            <Stop
              shortId={stop.shortId}
              stopNameFi={stop.name_fi}
              stopNameSv={stop.name_se}
              duration={stop.duration}
            />
        )) : null;
    };

    return (<div>
        {routeStops && isOpen ?
            <div className={styles.root}>
                {renderStops()}
            </div> : null}
    </div>);
};

export default StopList;
